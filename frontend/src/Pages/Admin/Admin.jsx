import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "../../api/client";
import listFromResponse from "../../api/listFromResponse";
import "./Admin.css";
import { useToast } from "../../Components/Toast/ToastProvider";

const stripHtml = (html) => String(html || "").replace(/<[^>]*>/g, "");

const Admin = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [heading, setHeading] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [eyecatch, setEyecatch] = useState("");
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    api
      .get("/user/showcategories")
      .then((res) => {
        setCategories(listFromResponse(res));
      })
      .catch((err) =>
        console.log("the use effect funcation error is here", err)
      );
  }, []);

  const previewUrl = useMemo(() => {
    if (!image) return "";
    return URL.createObjectURL(image);
  }, [image]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const photohandle = (e) => {
    const file = e.target.files?.[0];
    setImage(file || null);
  };

  const handleHeadingChange = (value) => {
    const headingText = stripHtml(value);
    if (headingText.length <= 50) {
      setHeading(value);
    } else {
      setHeading(headingText.slice(0, 50));
    }
  };

  const handleEyecatchChange = (value) => {
    const plainText = stripHtml(value);
    if (plainText.length <= 70) {
      setEyecatch(value);
    } else {
      setEyecatch(plainText.slice(0, 70));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (publishing) return;

    if (!image) {
      showToast("Please choose a cover image.", "error");
      return;
    }
    if (!stripHtml(heading).trim()) {
      showToast("Please add a headline.", "error");
      return;
    }
    if (!stripHtml(content).trim()) {
      showToast("Please write the article body.", "error");
      return;
    }
    if (!category) {
      showToast("Please select a category.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("content", content);
    formData.append("heading", heading);
    formData.append("category", category);
    formData.append("eyecatch", eyecatch);

    setPublishing(true);
    api
      .post("/user/upload", formData)
      .then(() => {
        showToast("Story published.", "success");
        navigate("/layout/account");
      })
      .catch((err) => {
        setPublishing(false);
        showToast(
          err.response?.data?.message || "Could not publish this story.",
          "error"
        );
      });
  };

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <main className="admin-page">
      <div className="admin-page__inner container">
        <header className="admin-page__hero">
          <p className="admin-page__kicker">The desk</p>
          <h1 className="admin-page__title">Write a story</h1>
          <p className="admin-page__lede">
            Add a cover, headline, optional deck, and body—then publish it to
            the archive.
          </p>
        </header>

        <form className="admin-form" onSubmit={handleSubmit} noValidate>
          <section className="admin-section">
            <label className="admin-label" htmlFor="post-cover-file">
              Cover image
            </label>
            <p className="admin-hint">
              JPG or PNG. This appears on cards and at the top of the article.
            </p>
            <div className="admin-cover">
              {previewUrl ? (
                <img src={previewUrl} alt="" className="admin-cover__img" />
              ) : (
                <div className="admin-cover__empty">No image chosen</div>
              )}
              <div className="admin-cover__row">
                <input
                  id="post-cover-file"
                  type="file"
                  accept="image/*"
                  className="admin-file"
                  onChange={photohandle}
                />
                <label htmlFor="post-cover-file" className="admin-file-btn">
                  Choose file
                </label>
                {image ? (
                  <span className="admin-file-name">{image.name}</span>
                ) : null}
              </div>
            </div>
          </section>

          <section className="admin-section heading-admin">
            <span className="admin-label">Headline</span>
            <p className="admin-hint">
              Short title for listings (max 50 characters).
            </p>
            <ReactQuill
              theme="snow"
              value={heading}
              onChange={handleHeadingChange}
              modules={{ toolbar: false }}
              placeholder="Your headline…"
            />
            <p className="admin-char">
              {stripHtml(heading).length}/50 characters
            </p>
          </section>

          <section className="admin-section thumnail-admin">
            <span className="admin-label">Deck / subtitle</span>
            <p className="admin-hint">
              One line that teases the story (max 70 characters). Shown in
              search and cards when set.
            </p>
            <ReactQuill
              theme="snow"
              value={eyecatch}
              onChange={handleEyecatchChange}
              modules={{ toolbar: false }}
              placeholder="Optional one-line summary…"
            />
            <p className="admin-char">
              {stripHtml(eyecatch).length}/70 characters
            </p>
          </section>

          <section className="admin-section admin-blog">
            <span className="admin-label">Article body</span>
            <p className="admin-hint">
              Use headings, lists, and links for a clean reading experience.
            </p>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              placeholder="Write your article…"
            />
          </section>

          <section className="admin-section">
            <label className="admin-label" htmlFor="post-category">
              Category
            </label>
            <select
              id="post-category"
              className="admin-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              {categories.map((cat, index) => (
                <option key={cat._id || index} value={cat.category}>
                  {cat.category}
                </option>
              ))}
            </select>
          </section>

          <div className="admin-actions">
            <button
              type="submit"
              className="admin-publish"
              disabled={publishing}
            >
              {publishing ? "Publishing…" : "Publish"}
            </button>
            <Link to="/layout/account" className="admin-cancel">
              Back to account
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Admin;

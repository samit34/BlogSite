import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "../../api/client";
import listFromResponse from "../../api/listFromResponse";
import "./Admin.css";

const Admin = () => {
  const [heading, setHeading] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [eyecatch, setEyecatch] = useState("");

  useEffect(() => {
    api
      .get("/user/showcategories")
      .then((res) => {
        setCategories(listFromResponse(res));
      })
      .catch((err) => console.log("the use effect funcation error is here", err));
  }, []);

  const photohandle = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("content", content);
    formData.append("heading", heading);
    formData.append("category", category);
    formData.append("eyecatch", eyecatch);

    api
      .post("/user/upload", formData)
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((err) => console.log(err));
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
    <main className="post-editor-page">
      <header className="post-editor-page__hero">
        <p className="post-editor-page__kicker">Editor</p>
        <h1 className="post-editor-page__title">Compose a story</h1>
        <p className="post-editor-page__lede">
          Add a cover image, headline, optional deck, body copy, and a
          category—then publish to the archive.
        </p>
      </header>

      <div className="sec-admin">
        <div className="post-editor-card">
          <div className="admin d-flex flex-column justify-content-center align-items-center gap-2">
            <div className="photo-admin post-editor-section">
              <label
                className="post-editor-section__label"
                htmlFor="post-cover-file"
              >
                Cover image
              </label>
              <p className="post-editor-section__hint">
                JPG or PNG; this appears on cards and at the top of the article.
              </p>
              <div className="post-editor-file">
                <input
                  id="post-cover-file"
                  type="file"
                  accept="image/*"
                  onChange={photohandle}
                />
                <label
                  htmlFor="post-cover-file"
                  className="post-editor-file__btn"
                >
                  Choose file
                </label>
                {image && (
                  <span className="post-editor-file__name">
                    {typeof image === "string" ? image : image.name}
                  </span>
                )}
              </div>
            </div>

            <div className="heading-admin post-editor-section">
              <span className="post-editor-section__label">Headline</span>
              <p className="post-editor-section__hint">
                Short title for listings (max 50 characters).
              </p>
              <ReactQuill
                theme="snow"
                value={heading}
                onChange={(value) => {
                  const headingText = value.replace(/<[^>]*>/g, "");
                  if (headingText.length <= 50) {
                    setHeading(value);
                  } else {
                    const trunheading = headingText.slice(0, 50);
                    setHeading(trunheading);
                  }
                }}
                modules={{ toolbar: false }}
                placeholder="Your headline…"
                style={{ overflow: "hidden" }}
              />
              <div className="post-editor-char text-black">
                {heading.replace(/<[^>]*>/g, "").length}/50 characters
              </div>
            </div>

            <div className="thumnail-admin post-editor-section">
              <span className="post-editor-section__label">Deck / subtitle</span>
              <p className="post-editor-section__hint">
                One line that teases the story (max 70 characters). Shown in
                search and cards when set.
              </p>
              <ReactQuill
                theme="snow"
                value={eyecatch}
                onChange={(value) => {
                  const plainText = value.replace(/<[^>]*>/g, "");
                  if (plainText.length <= 70) {
                    setEyecatch(value);
                  } else {
                    const truncated = plainText.slice(0, 70);
                    setEyecatch(truncated);
                  }
                }}
                modules={{ toolbar: false }}
                placeholder="Optional one-line summary…"
                style={{ height: "100px", overflow: "hidden" }}
              />
              <div className="post-editor-char text-black">
                {eyecatch.replace(/<[^>]*>/g, "").length}/70 characters
              </div>
            </div>

            <div className="admin-blog post-editor-section">
              <span className="post-editor-section__label">Article body</span>
              <p className="post-editor-section__hint">
                Use headings, lists, and links for a clean reading experience.
              </p>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                placeholder="Write your article…"
              />
            </div>

            <div className="post-editor-select-wrap post-editor-section">
              <label
                className="post-editor-section__label"
                htmlFor="post-category"
              >
                Category
              </label>
              <select
                id="post-category"
                className="post-editor-select"
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
            </div>

            <div className="post-editor-actions">
              <button type="button" className="post-btn" onClick={handleSubmit}>
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Admin;

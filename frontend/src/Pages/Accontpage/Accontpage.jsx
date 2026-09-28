import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api, { API_BASE_URL } from "../../api/client";
import DOMPurify from "dompurify";
import { FaCamera } from "react-icons/fa";
import "./Account.css";
import { useToast } from "../../Components/Toast/ToastProvider";
import ConfirmDialog from "../../Components/ConfirmDialog/ConfirmDialog";
import EmptyState from "../../Components/EmptyState/EmptyState";
import PageLoader from "../../Components/Loader/PageLoader";

const AccountPage = ({ serach = "" }) => {
  const { showToast } = useToast();
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [accountNotice, setAccountNotice] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  useEffect(() => {
    fetchAccountData();
  }, []);

  useEffect(() => {
    api
      .post("/user/photo", {})
      .then((res) => {
        if (res.status === 200 && res.data.photo) {
          setProfilePic(res.data.photo);
        }
      })
      .catch((err) => {
        console.log("Error fetching profile photo:", err);
      });
  }, []);

  const fetchAccountData = () => {
    api
      .post("/user/account", {})
      .then((res) => {
        const { account, user, success, message } = res.data;
        if (success === false) {
          setArticles([]);
          setUsername(user || "");
          setAccountNotice(message || "No posts found for this account");
          setError(null);
          setLoading(false);
          return;
        }
        setAccountNotice(null);
        setUsername(user || "");
        setArticles(account?.length ? account : []);
        setError(null);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch articles. Please try again later.");
        setLoading(false);
      });
  };

  const handlePhotoChange = (e) => {
    if (!e?.target?.files?.length) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("photo", file);

    api
      .post("/user/photo", formData)
      .then((res) => {
        if (res.status === 200 && res.data.photo) {
          showToast("Profile picture updated.", "success");
          setProfilePic(res.data.photo);
        } else {
          showToast("No new photo uploaded.", "info");
        }
      })
      .catch(() => {
        showToast("Failed to upload profile picture.", "error");
      });
  };

  const confirmDeleteBlog = () => {
    if (!deleteTargetId) return;
    const id = deleteTargetId;
    setDeleteTargetId(null);
    api
      .post("/user/card", { id })
      .then(() => {
        showToast("Blog deleted.", "success");
        fetchAccountData();
      })
      .catch(() => {
        showToast("Could not delete this post.", "error");
      });
  };

  const query = String(serach || "").toLowerCase();
  const filterblog = articles.filter((b) => {
    if (!b) return false;
    if (!query) return true;
    return (
      (b.heading || "").toLowerCase().includes(query) ||
      (b.category || "").toLowerCase().includes(query) ||
      (b.eyecatch && b.eyecatch.toLowerCase().includes(query))
    );
  });

  const photoSrc = profilePic
    ? `${API_BASE_URL}/uploads/${profilePic}`
    : "/editorial/portrait.jpg";

  return (
    <>
      <ConfirmDialog
        open={deleteTargetId != null}
        title="Delete this blog?"
        message="This will permanently delete your post. This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDeleteBlog}
        onCancel={() => setDeleteTargetId(null)}
      />
      <main className="account-page">
        <div className="account-page__inner container">
          {loading ? (
            <PageLoader message="Loading account details" variant="account" />
          ) : error ? (
            <EmptyState
              title="Could not load account"
              hint={error}
              className="empty-state--wide"
            />
          ) : (
            <>
              {accountNotice ? (
                <p className="account-page__notice">{accountNotice}</p>
              ) : null}

              <section className="profile-main">
                <div className="photo">
                  <div className="profile-pic-container">
                    <img
                      src={photoSrc}
                      alt={username ? `${username} profile` : "Profile"}
                      className="profile-pic"
                    />
                    <input
                      id="profilepic"
                      type="file"
                      accept="image/*"
                      className="profilepic"
                      onChange={handlePhotoChange}
                    />
                    <label htmlFor="profilepic" className="upload-icon">
                      <FaCamera aria-hidden />
                      <span className="account-page__sr">
                        Change profile photo
                      </span>
                    </label>
                  </div>
                </div>

                <div className="profilr-detail-container">
                  <div className="account-heading">
                    <h1 className="acc-heading">Account</h1>
                  </div>

                  <div className="profilr-container">
                    <div className="profile-details">
                      <div className="username">
                        <h4 className="username-account">
                          {username || "Writer"}
                        </h4>
                      </div>
                      <div className="post">
                        <span>Post :</span>
                        <span>{articles.length}</span>
                      </div>
                      <div className="add-blog-btn">
                        <Link to="/layout/admin" className="addblog">
                          Add blog
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {filterblog.length > 0 ? (
                <div className="blog-inner-container">
                  {filterblog.map((blog, index) => (
                    <article
                      key={blog._id || index}
                      className="account-card"
                    >
                      <div className="inner-card">
                        <Link to={`/layout/specificblog/${blog._id}`}>
                          <img
                            src={`${API_BASE_URL}/uploads/${blog.image}`}
                            alt=""
                          />
                          <div className="card-content">
                            <p className="account-card__cat">
                              {blog.category}
                            </p>
                            <div
                              className="card-heading"
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                  (blog.heading || "").slice(0, 70)
                                ),
                              }}
                            />
                          </div>
                        </Link>
                        <div className="card-detail">
                          <button
                            type="button"
                            className="delete-card"
                            onClick={() => setDeleteTargetId(blog._id)}
                          >
                            Delete card
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : articles.length === 0 ? (
                <EmptyState
                  title="No posts on your account"
                  hint="You have not published any articles yet. Use Add blog above to create your first post."
                  className="empty-state--wide"
                />
              ) : (
                <EmptyState
                  title="No matching posts"
                  hint="Nothing on your account matches the current search. Clear the search in the navbar to see everything you have published."
                  className="empty-state--wide"
                />
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default AccountPage;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api, { API_BASE_URL } from "../../api/client";
import DOMPurify from "dompurify";

import { FaCamera } from "react-icons/fa";
import "./Account.css";

const AccountPage = () => {
  const [articles, setArticles] = useState([]); // Articles state
  const [error, setError] = useState(null); // Error handling
  const [loading, setLoading] = useState(true); // Loading state
  const [username, setUsername] = useState(""); // Username
  const [profilePic, setProfilePic] = useState(""); // Profile picture URL
  const [accountNotice, setAccountNotice] = useState(null);

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
        if (account?.length) {
          setArticles(account);
          setUsername(user);
          setError(null);
        } else {
          setArticles([]);
          setError("No articles found.");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch articles. Please try again later.");
        setLoading(false);
      });
  };

  const handlePhotoChange = (e) => {
    if (!e?.target?.files?.length) {
      return;
    }

    // Upload selected file
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("photo", file);

    api
      .post("/user/photo", formData)
      .then((res) => {
        console.log("this is a response in a photo in set photo", res);
        if (res.status === 200 && res.data.photo) {
          // Update with the new photo
          alert("Profile picture updated successfully!");
          setProfilePic(res.data.photo);
        } else {
          console.log("No photo updated, showing user data:", res.data);
          alert("No new photo uploaded. Showing current profile information.");
        }
      })
      .catch((err) => {
        console.error("Error uploading profile picture:", err);
        alert("Failed to upload profile picture.");
      });
  };

  if (loading) {
    return <p>Loading account details...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  const deletecard = (id) => {
    console.log("this is a id in deletecard", id);

    api
      .post("/user/card", { id })
      .then((res) => {
        console.log("there is a  responsse of deletecard ", res);
        fetchAccountData();
      })
      .catch((error) => {
        console.log("there is a error in delete", error);
      });
  };

  return (
    <>
      <div className="account-page">
        <div className="container" style={{ padding: "auto" }}>
          {accountNotice && (
            <p className="text-muted text-center mb-2">{accountNotice}</p>
          )}
          <div className="profile-main">
            <div className="photo ">
              <div className="profile-pic-container">
                <img
                  src={`${API_BASE_URL}/uploads/${profilePic}`}
                  alt="Profile"
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
                  <FaCamera />
                </label>
              </div>
            </div>
            <div className="profilr-detail-container">
              <div className="account-heading">
                <h1 className="acc-heading"> ACCOUNT </h1>
              </div>

              <div className="profilr-container">
                <div className="profile-details">
                  <div className="username">
                    <h4 className="text-center username-account m-0">
                      {username}
                    </h4>
                  </div>

                  <div className="text-center post ">
                    <h4>Post : </h4>
                    <h4 className="m-0">{articles.length}</h4>
                  </div>

                  <div className="text-center m-0 add-blog-btn">
                    <button className="addblog">
                      <Link to={"/layout/admin"} className="addblog">
                        Add blog
                      </Link>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-12 blog-inner-container ">
            {articles.length > 0 ? (
              articles.map((blog, index) => {
                return (
                  <div
                    key={index}
                    className=" cards  col-lg-4 col-md-6 text-black text"
                  >
                    <div className="inner-card">
                      <Link to={`/layout/specificblog/${blog._id}`}>
                        <img
                          src={`${API_BASE_URL}/uploads/${blog.image}`}
                          alt=""
                        />
                        <div className="card-content ">
                          <p>{blog.category}</p>
                          <div
                            className="card-heading"
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(
                                blog.heading.slice(0, 50)
                              ),
                            }}
                          ></div>
                        </div>
                      </Link>
                      <div className="card-detail">
                        <button
                          className="delete-card"
                          onClick={() => deletecard(blog._id)}
                        >
                          Delete card
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>there is no data </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountPage;

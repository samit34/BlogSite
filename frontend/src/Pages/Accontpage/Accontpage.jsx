import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";

import { FaCamera } from "react-icons/fa";
import { useBlog } from "../Blogcontext";
import "./Account.css";
import coverImage from "../../images/cover-image.jpg";

const AccountPage = () => {
  const [articles, setArticles] = useState([]); // Articles state
  const [error, setError] = useState(null); // Error handling
  const [loading, setLoading] = useState(true); // Loading state
  const [username, setUsername] = useState(""); // Username
  const [profilePic, setProfilePic] = useState(""); // Profile picture URL
  const { handleLike } = useBlog();

  // Fetch account data and profile picture
  useEffect(() => {
    fetchAccountData();
    handlePhotoChange();
  }, []);

  const fetchAccountData = () => {
    const token = localStorage.getItem("token");

    axios
      .post(
        "http://localhost:8000/user/account",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        if (res.data.account) {
          setArticles(res.data.account);
          setUsername(res.data.user);
        } else {
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
    console.log("account");

    const token = localStorage.getItem("token");

    // If no file is selected, fetch the user's current photo
    if (!e || !e.target.files || e.target.files.length === 0) {
      console.log("No file selected. Fetching user profile photo...");

      axios
        .post(
          "http://localhost:8000/user/photo",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res.status === 200 && res.data.photo) {
            console.log("this is a repone in before photo", res);
            setProfilePic(res.data.photo);

            console.log("this is a ", profilePic);
          } else {
            console.log("User photo not found, showing user data:", res.data);
          }
        })
        .catch((err) => {
          console.log("Error fetching profile photo:", err);
        });
      return;
    }

    // If a file is selected, upload the photo
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("photo", file);

    axios
      .post("http://localhost:8000/user/photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
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

    axios
      .post("http://localhost:8000/user/card", { id })
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
          {/* <div className="profile-cover"><img src={coverImage} /></div> */}
          <div className="profile-main">
            <div className="photo ">
              <div className="profile-pic-container">
                <img
                  src={`http://localhost:8000/uploads/${profilePic}`}
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
                          src={`http://localhost:8000/uploads/${blog.image}`}
                          alt="there is a image"
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

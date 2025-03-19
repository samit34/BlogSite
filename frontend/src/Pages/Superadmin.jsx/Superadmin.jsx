import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Superadmin.css";
import { useBlog } from "../Blogcontext";
import DOMPurify from "dompurify";
import { AiFillLike } from "react-icons/ai";

import { Link } from "react-router-dom";
const Superadmin = () => {
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [user, setUser] = useState([]);

  const categoryRef = useRef(null);
  const userRef = useRef(null);
  const blogRef = useRef(null);

  const token = localStorage.getItem("token");

  const toggleTab = (ref) => {
    categoryRef.current.classList.remove("super-active");
    userRef.current.classList.remove("super-active");
    blogRef.current.classList.remove("super-active");

    ref.current.classList.add("super-active");
  };

  //   all blog
  const { fetchBlogs, handleLike, blog } = useBlog();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const deletecard = (id) => {
    console.log("this is a id in deletecard", id);

    axios
      .post("https://blogsite-208j.onrender.com/user/card", { id })
      .then((res) => {
        console.log("there is a  responsse of deletecard ", res);
        fetchBlogs();
      })

      .catch((error) => {
        console.log("there is a error in delete", error);
      });
  };

  const like = async (id) => {
    await handleLike(id);
  };

  const handleAddCategory = () => {
    console.log("Adding new category:", newCategory);

    // Save the new category to the database
    axios
      .post("https://blogsite-208j.onrender.com/user/categories", { category: newCategory })
      .then((res) => {
        setCategories([...categories, res.data.newCategory]);
        console.log("this is a response of handleaddcategory", res);

        setShowCategoryInput(false);
      })
      .catch((err) => {
        console.error("Error adding category:", err);
        setError("Failed to add category. Please try again.");
      });
  };

  const shows = () => {
    const token = localStorage.getItem("token");
    axios
      .get("https://blogsite-208j.onrender.com/user/showcategories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCategories(res.data);
        console.log("this is shows funcation responsse", res.data);
      })
      .catch((err) =>
        console.log("the use effect funcation error is here", err)
      );
  };

  useEffect(() => {
    shows();
  }, []);

  useEffect(() => {
    fetchuser();
  }, []);

  const fetchuser = () => {
    axios
      .get("https://blogsite-208j.onrender.com/user/showuser")
      .then((res) => {
        console.log("this is a res in showuser", res);
        setUser(res.data);
      })
      .catch((err) => {
        console.log("this is err in show user in frontend", err);
      });
  };
  const deletehandle = (cat) => {
    console.log("this this", cat);
    axios
      .post("https://blogsite-208j.onrender.com/user/deletecategory", { cat })
      .then((res) => {
        console.log("this is delete responde ", res);
        shows();
      })
      .catch((err) => {
        console.log("this is delete error", err);
      });
  };

  const deleteuser = (username) => {
    axios
      .post("https://blogsite-208j.onrender.com/user/deleteuser", { username })
      .then((res) => {
        alert("user delte sucessfully");
        console.log("response from", res);
      })

      .catch((error) => {
        alert("user not deleted");

        console.log("error from deleteuser", error);
      });
  };

  const blockuser = (username) => {
    axios
      .post(
        "https://blogsite-208j.onrender.com/user/userblock",
        { username },
        {
          headers: { Authorization: `bearer ${token} ` },
        }
      )
      .then((res) => {
        const updatedUsers = user.map((u) =>
          u.username === username
            ? { ...u, status: u.status === "active" ? "blocked" : "active" }
            : u
        );
        setUser(updatedUsers);
        console.log(" this is a update user", updatedUsers);
        console.log("this is a response from block user", res);
      })
      .catch((error) => {
        console.log("this is a error from block user", error);
      });
  };

  return (
    <>
      <div className="container p-0">
        <div className="tabs  ">
          <div className="tab-one" onClick={() => toggleTab(userRef)}>
            <h3>USER</h3>
          </div>
          <div className="tab-two" onClick={() => toggleTab(categoryRef)}>
            <h3>CATEGORY</h3>
          </div>
          <div className="tab-three" onClick={() => toggleTab(blogRef)}>
            <h3>BLOGS</h3>
          </div>
        </div>
      </div>

      <div className="container-fluid sec-super ">
        <div className="container super-inner-con">
          <div className="category super-active " ref={categoryRef}>
            {/* Add New Category Button */}
            <button
              className="add-cat mt-2"
              onClick={() => setShowCategoryInput(!showCategoryInput)}
            >
              Add New Category
            </button>

            {/* Error Message */}
            {error && <div className="alert alert-danger mt-2">{error}</div>}

            {/* New Category Input Panel */}
            {showCategoryInput && (
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Enter new category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="form-control"
                />
                <button
                  className="save-cat"
                  onClick={handleAddCategory}
                  disabled={!newCategory.trim()} // Disable if input is empty
                >
                  Save
                </button>
              </div>
            )}

            {/* List of Categories */}
            <div className="category-list   mt-4">
              <h3 className="text-black">Categories:</h3>

              <div className="list-container">
                <ul className="cat-list p-5">
                  {categories.map((category) => (
                    <li className="super-li">
                      {category.category}
                      <button
                        className="deletecategory"
                        onClick={() => deletehandle(category.category)}
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* user detail */}

          <div className="user   mt-4" ref={userRef}>
            <h3 className="text-black text-center ">Users: DETAILS</h3>
            <div className="super-user">
              <div className="inner-super-user">
                {user.map((user) => (
                  <div key={user.id} className="us">
                    <p className="super-username" key={user.id}>
                      {" "}
                      {user.username}
                    </p>

                    {console.log(" this is a user status", user.status)}

                    {user.status === "active" ? (
                      <button
                        className="delete-user"
                        onClick={() => blockuser(user.username)}
                      >
                        Block
                      </button>
                    ) : (
                      <button
                        className="delete-user"
                        onClick={() => blockuser(user.username)}
                      >
                        Unblock
                      </button>
                    )}

                    <button
                      className="delete-user"
                      onClick={() => deleteuser(user.username)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="allblog-none" ref={blogRef}>
            <div className="col-md-12 blog-inner-container  ">
              {blog.length > 0 ? (
                blog.map((blog, index) => {
                  return (
                    <div
                      key={index}
                      className=" cards  col-md-6 col-xl-4 text-black text"
                    >
                      <div className="inner-card">
                        <Link to={`/layout/specificblog/${blog._id}`}>
                          <img
                            src={`https://blogsite-208j.onrender.com/uploads/${blog.image}`}
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
      </div>
    </>
  );
};

export default Superadmin;

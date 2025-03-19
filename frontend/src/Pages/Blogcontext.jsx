import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

import { useAuth } from "./Authcontext";

const BlogContext = createContext();

const BlogContextProvider = ({ children }) => {
  // console.log("blogcontext")

  const { logout } = useAuth();
  const [blog, setBlog] = useState([]);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("https://blogsite-208j.onrender.com/user/showblog");

      setBlog(res.data);
    } catch (err) {
      console.log("err is here", err);
      if (err.response.data === "Token not found" || "Invalid token") {
        console.log("if is running");
      }
    }
  };

  // Handle like functionality
  const handleLike = async (id) => {
    console.log("hanmdle funcation is running ", id);
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "https://blogsite-208j.onrender.com/user/like",
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update blogs with the new like status
      const updatedBlogs = blog.map((b) =>
        b._id === id ? { ...b, liked: res.data.blog.liked } : b
      );
      console.log("handle response like", updatedBlogs);
      setBlog(updatedBlogs);
    } catch (err) {
      console.error("Error liking blog:", err);
    }
  };

  // Handle wishlist functionality
  const handleWishlist = async (id) => {
    console.log("This is the blog ID for wishlist:", id);
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "https://blogsite-208j.onrender.com/user/wishlist",
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {}
  };

  // Fetch blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <BlogContext.Provider
      value={{
        fetchBlogs,
        handleLike,
        handleWishlist,
        blog,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

// Custom hook to use BlogContext
export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("useBlog must be used within a BlogContextProvider");
  }
  return context;
};

export default BlogContextProvider;

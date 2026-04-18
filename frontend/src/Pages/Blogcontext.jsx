import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../api/client";
import listFromResponse from "../api/listFromResponse";

const BlogContext = createContext();

const BlogContextProvider = ({ children }) => {
  const [blog, setBlog] = useState([]);

  const fetchBlogs = useCallback(async () => {
    try {
      const res = await api.get("/user/showblog");
      setBlog(listFromResponse(res));
    } catch (err) {
      console.log("err is here", err);
      if (err.response?.data === "Token not found" || err.response?.data === "Invalid token") {
        console.log("if is running");
      }
    }
  }, []);

  // Handle like functionality
  const handleLike = async (id) => {
    console.log("hanmdle funcation is running ", id);
    try {
      const res = await api.post("/user/like", { id });

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
    try {
      await api.post("/user/wishlist", { id });
    } catch (err) {}
  };

  // Fetch blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

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

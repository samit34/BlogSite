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
  const [blogsLoading, setBlogsLoading] = useState(true);

  const fetchBlogs = useCallback(async () => {
    setBlogsLoading(true);
    try {
      const res = await api.get("/user/showblog");
      setBlog(listFromResponse(res));
    } catch (err) {
      console.log("err is here", err);
      if (err.response?.data === "Token not found" || err.response?.data === "Invalid token") {
        console.log("if is running");
      }
    } finally {
      setBlogsLoading(false);
    }
  }, []);

  const handleLike = useCallback(async (id) => {
    console.log("hanmdle funcation is running ", id);
    try {
      const res = await api.post("/user/like", { id });
      setBlog((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, liked: res.data.blog.liked } : b
        )
      );
    } catch (err) {
      console.error("Error liking blog:", err);
    }
  }, []);

  const handleWishlist = useCallback(async (id) => {
    console.log("This is the blog ID for wishlist:", id);
    try {
      await api.post("/user/wishlist", { id });
    } catch (err) {}
  }, []);

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
        blogsLoading,
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

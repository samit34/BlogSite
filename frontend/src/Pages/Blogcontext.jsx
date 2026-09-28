import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../api/client";
import listFromResponse from "../api/listFromResponse";
import { useToast } from "../Components/Toast/ToastProvider";
import { getCurrentUserId } from "../utils/currentUser";
import {
  addToWishlistWithToast,
  removeFromWishlistWithToast,
} from "../utils/wishlistNotify";

const BlogContext = createContext();

const BlogContextProvider = ({ children }) => {
  const [blog, setBlog] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState(() => new Set());
  const { showToast } = useToast();

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
    try {
      const res = await api.post("/user/like", { id });
      const liked = res.data.blog?.liked || [];
      setBlog((prev) =>
        prev.map((b) => (b._id === id ? { ...b, liked } : b))
      );
      const nowLiked = liked.map(String).includes(getCurrentUserId());
      showToast(nowLiked ? "Added to likes." : "Like removed.", "success");
      return liked;
    } catch (err) {
      showToast(
        err.response?.data?.message || "Could not update like.",
        "error"
      );
      return null;
    }
  }, [showToast]);

  const refreshWishlistIds = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      setWishlistIds(new Set());
      return;
    }
    try {
      const res = await api.post("/user/wish", {});
      const rows = listFromResponse(res);
      setWishlistIds(new Set(rows.map((row) => String(row._id))));
    } catch {
      setWishlistIds(new Set());
    }
  }, []);

  const isWished = useCallback(
    (id) => wishlistIds.has(String(id)),
    [wishlistIds]
  );

  const toggleWishlist = useCallback(
    async (id) => {
      const sid = String(id);
      if (wishlistIds.has(sid)) {
        const ok = await removeFromWishlistWithToast(api, id, showToast);
        if (ok) {
          setWishlistIds((prev) => {
            const next = new Set(prev);
            next.delete(sid);
            return next;
          });
        }
        return;
      }
      const ok = await addToWishlistWithToast(api, id, showToast);
      if (ok) {
        setWishlistIds((prev) => new Set(prev).add(sid));
      }
    },
    [showToast, wishlistIds]
  );

  const handleWishlist = useCallback(async (id) => {
    await toggleWishlist(id);
  }, [toggleWishlist]);

  // Fetch blogs on component mount
  useEffect(() => {
    fetchBlogs();
    refreshWishlistIds();
  }, [fetchBlogs, refreshWishlistIds]);

  return (
    <BlogContext.Provider
      value={{
        fetchBlogs,
        handleLike,
        handleWishlist,
        toggleWishlist,
        isWished,
        refreshWishlistIds,
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

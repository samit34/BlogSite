import React, { useCallback, useEffect, useState } from "react";
import api, { API_BASE_URL } from "../../api/client";
import listFromResponse from "../../api/listFromResponse";
import { Link } from "react-router-dom";
import "./Wishlist.css";
import DOMPurify from "dompurify";
import { AiFillLike } from "react-icons/ai";
import { useBlog } from "../Blogcontext";

import { FaBookmark } from "react-icons/fa";
import PageLoader from "../../Components/Loader/PageLoader";
import EmptyState from "../../Components/EmptyState/EmptyState";
import { useToast } from "../../Components/Toast/ToastProvider";
import ConfirmDialog from "../../Components/ConfirmDialog/ConfirmDialog";
import { removeFromWishlistWithToast } from "../../utils/wishlistNotify";

const Wishlist = ({ serach }) => {
  const { handleLike } = useBlog();
  const { showToast } = useToast();
  const [wishblog, setWishblog] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [removeTargetId, setRemoveTargetId] = useState(null);

  const fetchWishlist = useCallback(async (showLoader = false) => {
    if (showLoader) setListLoading(true);
    try {
      const res = await api.post("/user/wish", {});
      const rows = listFromResponse(res);
      setWishblog(rows);
      console.log("Fetched wishlist:", rows);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    } finally {
      if (showLoader) setListLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist(true);
  }, [fetchWishlist]);

  const handleLikeAndRefresh = async (id) => {
    try {
      await handleLike(id);

      fetchWishlist(false);
    } catch (err) {
      console.error("Error updating like:", err);
    }
  };

  const confirmRemoveFromWishlist = async () => {
    if (!removeTargetId) return;
    const id = removeTargetId;
    setRemoveTargetId(null);
    const ok = await removeFromWishlistWithToast(api, id, showToast);
    if (ok) fetchWishlist(false);
  };

  const filterblog = wishblog.filter((b) => {
    console.log("the filter funcation is running ");
    if (!b) return true;

    const lowserach = serach.toLowerCase();
    return (
      b.heading.toLowerCase().includes(lowserach) ||
      b.category.toLowerCase().includes(lowserach) ||
      (b.eyecatch && b.eyecatch.toLowerCase().includes(lowserach))
    );
  });

  return (
    <>
      <ConfirmDialog
        open={removeTargetId != null}
        title="Remove from wishlist?"
        message="This post will be removed from your saved list. You can add it again later from any article."
        confirmLabel="Remove"
        cancelLabel="Cancel"
        onConfirm={confirmRemoveFromWishlist}
        onCancel={() => setRemoveTargetId(null)}
      />
      <div className="wishlist-container  container">
        <h1 className="text-center ">Your Wishlist</h1>
        <div className="col-md-12 blog-inner-container ">
          {listLoading ? (
            <PageLoader message="Loading wishlist" />
          ) : filterblog.length > 0 ? (
            filterblog.map((blog, index) => {
              return (
                <div key={index} className=" cards  col-md-4 text-black text">
                  <div className="inner-card">
                    <button
                      type="button"
                      className="wishlist-remove"
                      onClick={() => setRemoveTargetId(blog._id)}
                      aria-label="Remove from wishlist"
                    >
                      <FaBookmark className="bookmark-icon" />
                    </button>
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
                      <p> post By {blog.username}</p>

                      <p>
                        {new Date(parseInt(blog.date)).toLocaleDateString()}
                      </p>
                      <button
                        className="like-home"
                        onClick={() => handleLikeAndRefresh(blog._id)}
                      >
                        {" "}
                        <AiFillLike /> {blog.liked.length}
                      </button>
                      {/* <button className='whislist-card-btn' onClick={() => wishlist(blog._id)}>add</button> */}
                    </div>
                  </div>
                </div>
              );
            })
          ) : wishblog.length === 0 ? (
            <EmptyState
              title="Your wishlist is empty"
              hint="Browse the blog and tap the bookmark on any article to save it here for later reading."
              className="empty-state--wide"
            />
          ) : (
            <EmptyState
              title="No matching saved posts"
              hint="Nothing in your wishlist matches the current search. Clear the search in the navbar to see everything you saved."
              className="empty-state--wide"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Wishlist;

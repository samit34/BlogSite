import React, { useCallback, useEffect, useState } from "react";
import api, { API_BASE_URL } from "../../api/client";
import listFromResponse from "../../api/listFromResponse";
import { Link } from "react-router-dom";
import "./Wishlist.css";
import "../../Components/editorial/editorial.css";
import DOMPurify from "dompurify";
import { useBlog } from "../Blogcontext";
import PageLoader from "../../Components/Loader/PageLoader";
import EmptyState from "../../Components/EmptyState/EmptyState";
import LikeButton from "../../Components/editorial/LikeButton";
import SaveButton from "../../Components/editorial/SaveButton";
import { userHasLiked } from "../../utils/currentUser";
import { useToast } from "../../Components/Toast/ToastProvider";
import ConfirmDialog from "../../Components/ConfirmDialog/ConfirmDialog";
import { removeFromWishlistWithToast } from "../../utils/wishlistNotify";
import { ScrollReveal } from "../../Components/motion/ScrollReveal";

const Wishlist = ({ serach = "" }) => {
  const { handleLike, refreshWishlistIds } = useBlog();
  const { showToast } = useToast();
  const [wishblog, setWishblog] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [removeTargetId, setRemoveTargetId] = useState(null);

  const fetchWishlist = useCallback(async (showLoader = false) => {
    if (showLoader) setListLoading(true);
    try {
      const res = await api.post("/user/wish", {});
      setWishblog(listFromResponse(res));
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
    const liked = await handleLike(id);
    if (liked) {
      setWishblog((prev) =>
        prev.map((b) => (b._id === id ? { ...b, liked } : b))
      );
    }
  };

  const confirmRemoveFromWishlist = async () => {
    if (!removeTargetId) return;
    const id = removeTargetId;
    setRemoveTargetId(null);
    const ok = await removeFromWishlistWithToast(api, id, showToast);
    if (ok) {
      setWishblog((prev) => prev.filter((b) => String(b._id) !== String(id)));
      if (refreshWishlistIds) refreshWishlistIds();
    }
  };

  const query = String(serach || "").toLowerCase();
  const filterblog = wishblog.filter((b) => {
    if (!b) return false;
    if (!query) return true;
    return (
      b.heading.toLowerCase().includes(query) ||
      b.category.toLowerCase().includes(query) ||
      (b.eyecatch && b.eyecatch.toLowerCase().includes(query))
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
      <main className="wishlist-page">
        <div className="wishlist-page__inner container">
          <header className="wishlist-page__hero">
            <p className="wishlist-page__kicker">Saved for later</p>
            <h1 className="wishlist-page__title">Your wishlist</h1>
            <p className="wishlist-page__lede">
              Stories you bookmarked—open them when you have a quiet hour.
            </p>
            {filterblog.length > 0 ? (
              <p className="wishlist-page__meta">
                {filterblog.length}{" "}
                {filterblog.length === 1 ? "saved story" : "saved stories"}
                {query ? ` · Filtered by “${serach}”` : ""}
              </p>
            ) : null}
          </header>

          {listLoading ? (
            <PageLoader message="Loading wishlist" variant="stories" />
          ) : filterblog.length > 0 ? (
            <div className="sq-archive">
              {filterblog.map((post, index) => (
                <ScrollReveal key={post._id || index} delay={Math.min(index * 0.05, 0.4)}>
                  <article className="sq-story">
                    <Link
                      className="sq-story__media"
                      to={`/layout/specificblog/${post._id}`}
                    >
                      <img
                        src={`${API_BASE_URL}/uploads/${post.image}`}
                        alt=""
                      />
                    </Link>
                    <div className="sq-story__body">
                      <div className="sq-story__top">
                        <span className="sq-story__num">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="sq-story__cat">{post.category}</span>
                      </div>
                      <h2 className="sq-story__title">
                        <Link
                          to={`/layout/specificblog/${post._id}`}
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              post.heading.slice(0, 140)
                            ),
                          }}
                        />
                      </h2>
                      <p className="sq-story__meta">
                        {post.username} ·{" "}
                        {new Date(parseInt(post.date)).toLocaleDateString()}
                      </p>
                      <div className="sq-story__tools">
                        <LikeButton
                          count={post.liked?.length}
                          active={userHasLiked(post.liked)}
                          onClick={() => handleLikeAndRefresh(post._id)}
                        />
                        <SaveButton
                          active
                          onClick={() => setRemoveTargetId(post._id)}
                        />
                        <Link
                          className="sq-story__read"
                          to={`/layout/specificblog/${post._id}`}
                        >
                          Read story
                        </Link>
                      </div>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          ) : wishblog.length === 0 ? (
            <EmptyState
              title="Your wishlist is empty"
              hint="Browse the archive and tap the bookmark on any article to save it here for later."
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
      </main>
    </>
  );
};

export default Wishlist;

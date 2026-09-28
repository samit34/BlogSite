import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../api/client";
import "react-quill/dist/quill.snow.css";
import "./blog.css";
import "../../Components/editorial/editorial.css";
import DOMPurify from "dompurify";
import { useBlog } from "../Blogcontext";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { ScrollReveal } from "../../Components/motion/ScrollReveal";
import PageLoader from "../../Components/Loader/PageLoader";
import EmptyState from "../../Components/EmptyState/EmptyState";
import LikeButton from "../../Components/editorial/LikeButton";
import SaveButton from "../../Components/editorial/SaveButton";
import { userHasLiked } from "../../utils/currentUser";

const Blog = ({ serach = "" }) => {
  const { fetchBlogs, handleLike, toggleWishlist, isWished, blog, blogsLoading } =
    useBlog();

  const [pages, setPages] = useState(1);
  const properties_per_page = 8;

  const goToPage = (next) => {
    setPages(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const filterblog = blog.filter((b) => {
    if (!b) return true;
    const lowserach = String(serach || "").toLowerCase();
    if (!lowserach) return true;
    return (
      b.heading.toLowerCase().includes(lowserach) ||
      b.category.toLowerCase().includes(lowserach) ||
      (b.eyecatch && b.eyecatch.toLowerCase().includes(lowserach))
    );
  });

  const pageCount = Math.max(
    1,
    Math.ceil(filterblog.length / properties_per_page) || 1
  );

  useEffect(() => {
    setPages(1);
  }, [serach]);

  useEffect(() => {
    if (pages > pageCount) {
      setPages(pageCount);
    }
  }, [pages, pageCount]);

  const pageSlice = filterblog.slice(
    pages * properties_per_page - properties_per_page,
    pages * properties_per_page
  );

  const PAGE_WINDOW = 5;
  const windowStart = Math.min(
    Math.max(1, pages - Math.floor(PAGE_WINDOW / 2)),
    Math.max(1, pageCount - PAGE_WINDOW + 1)
  );
  const windowEnd = Math.min(pageCount, windowStart + PAGE_WINDOW - 1);
  const visiblePages = [];
  for (let n = windowStart; n <= windowEnd; n += 1) {
    visiblePages.push(n);
  }

  return (
    <main className="blog-page">
      <div className="blog-container container">
        {blogsLoading ? (
          <>
            <header className="blog-page__hero">
              <p className="blog-page__kicker">The archive</p>
              <h1 className="blog-page__title">All stories</h1>
              <p className="blog-page__lede">
                A quiet index of every published piece. Search or filter from
                the menu to narrow the list.
              </p>
            </header>
            <PageLoader variant="stories" />
          </>
        ) : (
          <>
            <header className="blog-page__hero">
              <p className="blog-page__kicker">The archive</p>
              <h1 className="blog-page__title">All stories</h1>
              <p className="blog-page__lede">
                A quiet index of every published piece. Search or filter from
                the menu to narrow the list.
              </p>
              {filterblog.length > 0 ? (
                <p className="blog-page__meta" aria-live="polite">
                  <span className="blog-page__meta-count">
                    {filterblog.length}{" "}
                    {filterblog.length === 1 ? "story" : "stories"}
                  </span>
                  {serach ? (
                    <span className="blog-page__meta-filter">
                      · Filtered by &ldquo;{serach}&rdquo;
                    </span>
                  ) : null}
                </p>
              ) : null}
            </header>

            {filterblog.length > 0 ? (
              <div className="sq-archive">
                {pageSlice.map((post, index) => {
                  const num =
                    (pages - 1) * properties_per_page + index + 1;
                  return (
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
                              {String(num).padStart(2, "0")}
                            </span>
                            <span className="sq-story__cat">
                              {post.category}
                            </span>
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
                              onClick={() => handleLike(post._id)}
                            />
                            <SaveButton
                              active={isWished(post._id)}
                              onClick={() => toggleWishlist(post._id)}
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
                  );
                })}
              </div>
            ) : blog.length === 0 ? (
              <EmptyState
                title="No blogs yet"
                hint="There are no published posts to show. Check back later—or sign in and add a story from the editor if you have access."
                className="empty-state--wide"
              />
            ) : (
              <EmptyState
                title="No matching posts"
                hint="Nothing matches your current search. Try different keywords or clear the search in the navbar to see all posts."
                className="empty-state--wide"
              />
            )}

            {filterblog.length > 0 && pageCount > 1 ? (
              <nav className="sq-pager" aria-label="Archive pages">
                <button
                  type="button"
                  className="sq-pager__btn"
                  onClick={() => goToPage(pages - 1)}
                  disabled={pages <= 1}
                  aria-label="Previous page"
                >
                  <FaAngleLeft aria-hidden />
                </button>
                {visiblePages.map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`sq-pager__btn${
                        n === pages ? " sq-pager__btn--active" : ""
                      }`}
                      onClick={() => goToPage(n)}
                      aria-current={n === pages ? "page" : undefined}
                    >
                      {n}
                    </button>
                ))}
                <button
                  type="button"
                  className="sq-pager__btn"
                  onClick={() => goToPage(pages + 1)}
                  disabled={pages >= pageCount}
                  aria-label="Next page"
                >
                  <FaAngleRight aria-hidden />
                </button>
              </nav>
            ) : null}
          </>
        )}
      </div>
    </main>
  );
};

export default Blog;

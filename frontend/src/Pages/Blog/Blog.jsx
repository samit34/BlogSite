import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api, { API_BASE_URL } from "../../api/client";
import "react-quill/dist/quill.snow.css";
import "./blog.css";
import DOMPurify from "dompurify";
import { AiFillLike } from "react-icons/ai";
import { useBlog } from "../Blogcontext";
import ReactPaginate from "react-paginate";
import { FaAngleLeft } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";

import { FaBookmark } from "react-icons/fa";
import { ScrollReveal } from "../../Components/motion/ScrollReveal";
import PageLoader from "../../Components/Loader/PageLoader";
import { useToast } from "../../Components/Toast/ToastProvider";
import { addToWishlistWithToast } from "../../utils/wishlistNotify";
import EmptyState from "../../Components/EmptyState/EmptyState";

const Blog = ({ serach }) => {
  const { fetchBlogs, handleLike, blog, blogsLoading } = useBlog();
  const { showToast } = useToast();

  const [pages, setPages] = useState(1);
  const properties_per_page = 12;

  const handlepages = (event) => {
    const pagenumber = event.selected + 1;

    setPages(pagenumber);
  };

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const wishlist = (id) => {
    addToWishlistWithToast(api, id, showToast);
  };
  const filterblog = blog.filter((b) => {
    if (!b) return true;
    const lowserach = serach.toLowerCase();
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

  return (
    <>
      <main className="blog-page">
        <div className="blog-container container">
          {blogsLoading ? (
            <PageLoader message="Loading blogs" />
          ) : (
            <>
              <header className="blog-page__hero">
                <p className="blog-page__kicker">Stories</p>
                <h1 className="blog-page__title">The archive</h1>
                <p className="blog-page__lede">
                  Browse every published piece—filter from the navbar or search to
                  narrow the list.
                </p>
                {filterblog.length > 0 ? (
                  <p className="blog-page__meta" aria-live="polite">
                    <span className="blog-page__meta-count">
                      {filterblog.length} post{filterblog.length !== 1 ? "s" : ""}
                    </span>
                    {serach ? (
                      <span className="blog-page__meta-filter">
                        · Filtered by &ldquo;{serach}&rdquo;
                      </span>
                    ) : null}
                  </p>
                ) : null}
              </header>

              <div className="row g-4 blog-inner-container blog-page__grid">
                {filterblog.length > 0 ? (
                  pageSlice.map((post, index) => {
                      return (
                        <ScrollReveal
                          key={post._id || index}
                          className="blog-page__col col-md-6 col-xl-4"
                          delay={Math.min(index * 0.06, 0.54)}
                        >
                          <article className="blog-page-card">
                            <button
                              type="button"
                              className="wishlist-bookmark-trigger"
                              onClick={() => wishlist(post._id)}
                              aria-label="Save to wishlist"
                            >
                              <FaBookmark className="bookmark-icon" />
                            </button>
                            <Link
                              className="blog-page-card__link"
                              to={`/layout/specificblog/${post._id}`}
                            >
                              <div className="blog-page-card__image-wrap">
                                <img
                                  className="blog-page-card__img"
                                  src={`${API_BASE_URL}/uploads/${post.image}`}
                                  alt=""
                                />
                              </div>
                              <div className="blog-page-card__body">
                                <span className="blog-page-card__cat">
                                  {post.category}
                                </span>
                                <div
                                  className="blog-page-card__title"
                                  dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                      post.heading.slice(0, 120)
                                    ),
                                  }}
                                />
                                <span className="blog-page-card__read">
                                  Read article →
                                </span>
                              </div>
                            </Link>
                            <div className="blog-page-card__footer">
                              <span>By {post.username}</span>
                              <span>
                                {new Date(
                                  parseInt(post.date)
                                ).toLocaleDateString()}
                              </span>
                              <button
                                type="button"
                                className="like-home"
                                onClick={() => handleLike(post._id)}
                              >
                                <AiFillLike /> {post.liked.length}
                              </button>
                            </div>
                          </article>
                        </ScrollReveal>
                      );
                    })
                ) : blog.length === 0 ? (
                  <div className="blog-page__empty">
                    <EmptyState
                      title="No blogs yet"
                      hint="There are no published posts to show. Check back later—or sign in and add a story from the editor if you have access."
                      className="empty-state--wide"
                    />
                  </div>
                ) : (
                  <div className="blog-page__empty">
                    <EmptyState
                      title="No matching posts"
                      hint="Nothing matches your current search. Try different keywords or clear the search in the navbar to see all posts."
                      className="empty-state--wide"
                    />
                  </div>
                )}
              </div>

              <div className="pagination_div blog-page__pagination">
                {filterblog.length > 0 && pageCount > 1 ? (
              <ReactPaginate
                previousLabel={<FaAngleLeft />}
                nextLabel={<FaAngleRight />}
                breakLabel={"..."}
                pageCount={pageCount}
                forcePage={Math.min(pages - 1, pageCount - 1)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={2}
                onPageChange={handlepages}
                containerClassName={"page-btn"}
                activeClassName={"active-pagination-btn"}
                previousClassName={"previous-button"}
                nextClassName={"next-button"}
                breakClassName={"break-me"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
              />
                ) : null}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default Blog;

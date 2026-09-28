





import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { API_BASE_URL } from '../../api/client';
import DOMPurify from 'dompurify';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/footer/Footer';
import './Specificblog.css';
import LikeButton from '../../Components/editorial/LikeButton';
import SaveButton from '../../Components/editorial/SaveButton';
import { useBlog } from '../Blogcontext';
import { ScrollReveal, ScrollRevealWide } from '../../Components/motion/ScrollReveal';
import EmptyState from '../../Components/EmptyState/EmptyState';
import PageLoader from '../../Components/Loader/PageLoader';
import { userHasLiked } from '../../utils/currentUser';

const Specificblog = () => {
  const { handleLike, toggleWishlist, isWished, blog } = useBlog();
  const { id } = useParams();
  const [sblog, setBlog] = useState(null);
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(true);

  const oneblog = useCallback(async () => {
    setPending(true);
    try {
      const res = await api.post(`/user/specificblog/${id}`);
      setBlog(res.data[0]);
      setError(null);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Failed to fetch blog. Please try again.";
      setError(msg);
      setBlog(null);
    } finally {
      setPending(false);
    }
  }, [id]);

  useEffect(() => {
    oneblog();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [oneblog]);

  const runagain = async () => {
    if (!sblog) return;
    const liked = await handleLike(sblog._id);
    if (liked) {
      setBlog((prev) => (prev ? { ...prev, liked } : prev));
    }
  };

 

  return (
    <> 

      <Navbar />
      <div className="container specificblog-wrap">
        {error && <p className="specificblog-error">{error}</p>}

        {pending ? (
          <PageLoader message="Loading article" variant="article" />
        ) : sblog ? (
          <ScrollRevealWide>
            <article className="specific-article">
              <header className="specific-article__header">
                <span className="specific-article__cat">{sblog.category}</span>
                <h1
                  className="specific-article__title"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(sblog.heading),
                  }}
                />
                {sblog.eyecatch ? (
                  <div
                    className="specific-article__deck"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(sblog.eyecatch),
                    }}
                  />
                ) : null}
                <div className="specific-article__meta">
                  <span>By {sblog.username}</span>
                  <span className="specific-article__meta-sep">·</span>
                  <time dateTime={new Date(parseInt(sblog.date)).toISOString()}>
                    {new Date(parseInt(sblog.date)).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
              </header>

              <figure className="specific-article__figure">
                <img
                  src={`${API_BASE_URL}/uploads/${sblog.image}`}
                  alt=""
                />
              </figure>

              <div
                className="specific-article__body"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(sblog.content),
                }}
              />

              <div className="specific-article__actions">
                <LikeButton
                  count={sblog.liked?.length}
                  active={userHasLiked(sblog.liked)}
                  onClick={runagain}
                />
              </div>
            </article>
          </ScrollRevealWide>
        ) : !error ? (
          <EmptyState
            title="Article not found"
            hint="This post may have been removed or the link is incorrect. Return home and open another story from the list."
            className="empty-state--wide"
          />
        ) : null}

        <section className="specific-related" aria-labelledby="specific-related-heading">
          <ScrollReveal>
            <h2 id="specific-related-heading" className="specific-related__title">
              More stories
            </h2>
          </ScrollReveal>
          <div className="col-md-12 blog-inner-container specific-related__grid">
          {blog.length > 0 ? (
            blog.slice(3,6 ).map((b, index) => (
              <ScrollReveal
                key={b._id || index}
                className="cards col-md-4 text-black text"
                delay={Math.min(index * 0.08, 0.4)}
              >
                <div className="inner-card">
                  <SaveButton
                    className="wishlist-bookmark-trigger"
                    active={isWished(b._id)}
                    onClick={() => toggleWishlist(b._id)}
                  />
                  <Link to={`/layout/specificblog/${b._id}`}>
                    <img
                      src={`${API_BASE_URL}/uploads/${b.image}`}
                      alt=""
                    />
                    <div
                      className="card-heading"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(b.heading.slice(0, 50)),
                      }}
                    ></div>
                  </Link>
                  <div className="card-detail">
                    <p>Post By {b.username}</p>
                    <p>{new Date(parseInt(b.date)).toLocaleDateString()}</p>
                    <LikeButton
                      count={b.liked?.length}
                      active={userHasLiked(b.liked)}
                      onClick={() => handleLike(b._id)}
                    />
                  </div>
                </div>
              </ScrollReveal>
            ))
          ) : (
            <EmptyState
              title="No more posts to show"
              hint="There are no other stories to display here yet. Explore the home page for the full archive."
              className="empty-state--wide"
            />
          )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Specificblog;


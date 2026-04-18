





import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { API_BASE_URL } from '../../api/client';
import DOMPurify from 'dompurify';
import { AiFillLike } from "react-icons/ai";
import { FaBookmark } from "react-icons/fa";
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/footer/Footer';
import './Specificblog.css';
import { useBlog } from '../Blogcontext';
import { ScrollReveal, ScrollRevealWide } from '../../Components/motion/ScrollReveal';

const Specificblog = () => {
  const { handleLike, blog } = useBlog();
  const { id } = useParams();
  const [sblog, setBlog] = useState(null);
  const [error, setError] = useState(null);

  const oneblog = useCallback(async () => {
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
    }
  }, [id]);

  useEffect(() => {
    oneblog();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [oneblog]);

  const runagain = async () => {
    if (sblog) {
      await handleLike(sblog._id);
      oneblog();
    }
  };

  const wishlist = async (id) => {
    // setWishlistLoading(true);
    try {
      await api.post('/user/wishlist', { id });
      alert("Card added successfully");
    } catch (err) {
      alert("Card already added");
    } 
  };

 

  return (
    <> 

      <Navbar />
      <div className="container">
        <ScrollReveal>
          <h1 className="text-center">This is a specific blog</h1>
        </ScrollReveal>

        {error && <p className="error">{error}</p>}

        {sblog ? (
          <ScrollRevealWide>
          <div className="specific-container">
            <div
              className="card-heading"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(sblog.heading.slice(0, 50)),
              }}
            ></div>

            <img
              src={`${API_BASE_URL}/uploads/${sblog.image}`}
              alt=""
            />
            <p
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(sblog.content),
              }}
            ></p>

            <div className="specific-blog-detail">
              <button className="like" onClick={runagain}>
                <AiFillLike /> {sblog.liked.length}
              </button>

              <p>Posted by {sblog.username}</p>
              <p>Posted on {new Date(parseInt(sblog.date)).toLocaleDateString()}</p>
            </div>
          </div>
          </ScrollRevealWide>
        ) : (
          <p>Loading blog...</p>
        )}

        <div className="col-md-12 blog-inner-container">
          {blog.length > 0 ? (
            blog.slice(3,6 ).map((b, index) => (
              <ScrollReveal
                key={b._id || index}
                className="cards col-md-4 text-black text"
                delay={Math.min(index * 0.08, 0.4)}
              >
                <div className="inner-card">
                  <Link onClick={() => wishlist(b._id)}>
                    <FaBookmark className="bookmark-icon" />
                  </Link>
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
                    <button
                      className="like-home"
                      onClick={() => handleLike(b._id)}
                    >
                      <AiFillLike /> {b.liked.length}
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            ))
          ) : (
            <p>There is no data</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Specificblog;


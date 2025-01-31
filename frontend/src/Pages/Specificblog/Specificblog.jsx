





import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { AiFillLike } from "react-icons/ai";
import { FaBookmark } from "react-icons/fa";
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/footer/Footer';
import './Specificblog.css';
import { useBlog } from '../Blogcontext';

const Specificblog = () => {
  const { handleLike, blog } = useBlog();
  const { id } = useParams();
  const [sblog, setBlog] = useState(null);
  const [error, setError] = useState(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    oneblog();
    window.scrollTo({ top: 0, behavior: 'smooth' });

  }, [id]);

  const oneblog = async () => {
    try {
      const res = await axios.post(`http://localhost:8000/user/specificblog/${id}`);
      setBlog(res.data[0]);
    } catch (err) {
      setError("Failed to fetch blog. Please try again.");
    }
  };

  const runagain = async () => {
    if (sblog) {
      await handleLike(sblog._id);
      oneblog();
    }
  };

  const wishlist = async (id) => {
    // setWishlistLoading(true);
    const token = localStorage.getItem("token");
    try {
      await axios.post('http://localhost:8000/user/wishlist', { id }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Card added successfully");
    } catch (err) {
      alert("Card already added");
    } 
  };

  // Utility to shuffle an array
  // const shuffleArray = (array) => {
  //   return array
  //     .map((item) => ({ ...item, sort: Math.random() }))
  //     .sort((a, b) => a.sort - b.sort)
  //     .map((item) => item);
  // };

  // // Filter and shuffle related blogs
  // const getRandomBlogs = () => {
  //   if (!Array.isArray(blog)) return [];
  //   const filteredBlogs = blog.filter((b) => b._id !== sblog?._id); // Exclude the current blog
  //   return shuffleArray(filteredBlogs).slice(0, 3); // Get 2 random blogs
  // };

  // const relatedBlogs = getRandomBlogs();

  return (
    <> 

      <Navbar />
      <div className="container">
        <h1 className="text-center">This is a specific blog</h1>

        {error && <p className="error">{error}</p>}

        {sblog ? (
          <div className="specific-container">
            <div
              className="card-heading"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(sblog.heading.slice(0, 50)),
              }}
            ></div>

            <img
              src={`http://localhost:8000/uploads/${sblog.image}`}
              alt={sblog.heading || "Blog Image"}
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
        ) : (
          <p>Loading blog...</p>
        )}

        <div className="col-md-12 blog-inner-container">
          {blog.length > 0 ? (
            blog.slice(3,6 ).map((b, index) => (
              <div key={index} className="cards col-md-4 text-black text">
                <div className="inner-card">
                  <Link onClick={() => wishlist(b._id)}>
                    <FaBookmark className="bookmark-icon" />
                  </Link>
                  <Link to={`/layout/specificblog/${b._id}`}>
                    <img
                      src={`http://localhost:8000/uploads/${b.image}`}
                      alt="Blog Image"
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
              </div>
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


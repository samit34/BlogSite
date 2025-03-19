import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Wishlist.css";
import DOMPurify from "dompurify";
import { AiFillLike } from "react-icons/ai";
import { useBlog } from "../Blogcontext";

import { FaBookmark } from "react-icons/fa";

const Wishlist = ({ val, serach }) => {
  const { handleLike } = useBlog();
  const [wishblog, setWishblog] = useState([]);

  const [homecat, setHomecat] = useState([]);

  useEffect(() => {
    axios
      .get("https://blogsite-208j.onrender.com/user/homecategory")
      .then((res) => {
        setHomecat(res.data);
      })
      .catch((err) => {
        console.log("this is a err in navbar", err);
      });
  }, []);

  const fetchWishlist = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        "https://blogsite-208j.onrender.com/user/wish",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setWishblog(res.data);
      console.log("Fetched wishlist:", res.data);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleLikeAndRefresh = async (id) => {
    try {
      await handleLike(id);

      fetchWishlist();
    } catch (err) {
      console.error("Error updating like:", err);
    }
  };

  const deletewish = (id) => {
    const token = localStorage.getItem("token");
    axios
      .post(
        "https://blogsite-208j.onrender.com/user/deletecard",
        { id },
        {
          headers: { Authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        console.log("card delete succesfully", res);
        fetchWishlist();
      })
      .catch((err) => {
        console.log("this is a err in delete wish card", err);
      });
  };

  const filterblog = wishblog.filter((b) => {
    console.log("the filter funcation is running ");
    if (!b) return true;

    const lowserach = serach.toLowerCase();
    return (
      b.heading.toLowerCase().includes(lowserach) ||
      b.category.toLowerCase().includes(lowserach) ||
      b.eyecatch.toLowerCase().includes(lowserach)
    );
  });

  return (
    <>
      <div className="wishlist-container  container">
        <h1 className="text-center ">Your Wishlist</h1>
        <div className="col-md-12 blog-inner-container ">
          {filterblog.length > 0 ? (
            filterblog.map((blog, index) => {
              return (
                <div key={index} className=" cards  col-md-4 text-black text">
                  <div className="inner-card">
                    <Link className="" onClick={() => deletewish(blog._id)}>
                      {" "}
                      <FaBookmark className="bookmark-icon" />{" "}
                    </Link>
                    <Link to={`/layout/specificblog/${blog._id}`}>
                      <img
                        src={`https://blogsite-208j.onrender.com/uploads/${blog.image}`}
                        alt="there is a image"
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
                        onClick={() => handleLike(blog._id)}
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
          ) : (
            <p>there is no data </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Wishlist;

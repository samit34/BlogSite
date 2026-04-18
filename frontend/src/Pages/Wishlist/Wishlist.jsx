import React, { useEffect, useState } from "react";
import api, { API_BASE_URL } from "../../api/client";
import listFromResponse from "../../api/listFromResponse";
import { Link } from "react-router-dom";
import "./Wishlist.css";
import DOMPurify from "dompurify";
import { AiFillLike } from "react-icons/ai";
import { useBlog } from "../Blogcontext";

import { FaBookmark } from "react-icons/fa";

const Wishlist = ({ serach }) => {
  const { handleLike } = useBlog();
  const [wishblog, setWishblog] = useState([]);

  const fetchWishlist = async () => {
    try {
      const res = await api.post("/user/wish", {});
      const rows = listFromResponse(res);
      setWishblog(rows);
      console.log("Fetched wishlist:", rows);
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
    api
      .post("/user/deletecard", { id })
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
          ) : (
            <p>there is no data </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Wishlist;

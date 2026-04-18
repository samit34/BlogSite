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

const Blog = ({ serach }) => {
  const { fetchBlogs, handleLike, blog } = useBlog();

  const [counting, setCounting] = useState(0);
  const [pages, setPages] = useState(1);
  const properties_per_page = 12;

  const pageCount = Math.ceil(counting / properties_per_page);

  const handlepages = (event) => {
    const pagenumber = event.selected + 1;

    setPages(pagenumber);
  };

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  useEffect(() => {
    if (blog.length > 0) {
      setCounting(blog.length);
    }
  }, [blog]);

  const wishlist = (id) => {
    api
      .post("/user/wishlist", { id })
      .then((res) => {
        alert("Card added succesfully");
        // console.log("this is  response of wishlist ", res);
      })
      .catch((err) => {
        alert("card already added");
        // console.log("this is a err of wishlis", err)
      });
  };
  const filterblog = blog.filter((b) => {
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
      <div className="blog-container container">
        <div className="col-md-12 blog-inner-container ">
          {filterblog.length > 0 ? (
            filterblog.slice(pages * 12 - 12, pages * 12).map((blog, index) => {
              return (
                <ScrollReveal
                  key={blog._id || index}
                  className=" cards  col-md-6 col-xl-4 text-black text"
                  delay={Math.min(index * 0.06, 0.54)}
                >
                  <div className="inner-card">
                    <Link className="" onClick={() => wishlist(blog._id)}>
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
                        onClick={() => handleLike(blog._id)}
                      >
                        {" "}
                        <AiFillLike /> {blog.liked.length}
                      </button>
                      {/* <button className='whislist-card-btn' onClick={() => wishlist(blog._id)}>add</button> */}
                    </div>
                  </div>
                </ScrollReveal>
              );
            })
          ) : (
            <p>there is no data </p>
          )}
        </div>

        <div className="pagination_div">
          <ReactPaginate
            previousLabel={<FaAngleLeft />}
            nextLabel={<FaAngleRight />}
            breakLabel={"..."}
            pageCount={pageCount}
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
        </div>
      </div>
    </>
  );
};

export default Blog;

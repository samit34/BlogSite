import React, { useState, useEffect, useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import "./Home.css";
import DOMPurify from "dompurify";
import { AiFillLike } from "react-icons/ai";
import { useBlog } from "../Blogcontext";

import { CiSearch } from "react-icons/ci";

// new nav icon

import { FaInstagram } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { VscAccount } from "react-icons/vsc";
import { PiHandbagLight } from "react-icons/pi";
import TopBarSlider from "../../Components/slider/TopBarSlider";
import { HiBars3BottomLeft } from "react-icons/hi2";
import { FaBookmark } from "react-icons/fa";
import { useAuth } from "../Authcontext";
import Footer from "../../Components/footer/Footer";

const Home = React.memo(() => {
  const serachref = useRef();
  // const navRef = useRef()
  const [serach, setSerach] = useState("");
  const token = localStorage.getItem("token");
  const { logout } = useAuth();

  const val = (id) => {
    setSerach(id);
  };

  const showserach = () => {
    serachref.current.classList.toggle("active-serach");
  };

  // navbar finish here
  const { fetchBlogs, handleLike, blog } = useBlog();
  const { showblogs, setShowblogs } = useState([blog]);
  const [homecat, setHomecat] = useState([]);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    axios
      .get("/user/homecategory")
      .then((res) => {
        setHomecat(res.data);
      })
      .catch((err) => {
        console.log("this is a err in navbar", err);
      });
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const wishlist = (id) => {
    const token = localStorage.getItem("token");
    axios
      .post(
        "/user/wishlist",
        { id },
        {
          headers: { Authorization: `bearer ${token}` },
        }
      )
      .then((res) => {
        alert("Card added succesfully");
      })
      .catch((err) => {
        alert("card already added");
      });
  };

  // const shuffleArray = (array) => {
  //   return array
  //     .map((item) => ({ ...item, sort: Math.random() }))
  //     .sort((a, b) => a.sort - b.sort)
  //     .map((item) => item);
  // };

  // const getRandomBlogs = () => {
  //   if (!Array.isArray(blog)) return [];
  //   const filteredBlogs = blog.filter((b) => b._id !== blog?._id);
  //   return shuffleArray(filteredBlogs)
  // };
  // const relatedBlogs = getRandomBlogs();

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
      {/* new nav start from here */}
      <nav>
        <div
          class="offcanvas offcanvas-start"
          tabindex="-1"
          id="offcanvasExample"
          aria-labelledby="offcanvasExampleLabel"
        >
          <div class="offcanvas-header">
            <h5 class="offcanvas-title text-white " id="offcanvasExampleLabel">
              Feature
            </h5>
            <button
              type="button"
              class="btn-close text-white bg-white"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div class="offcanvas-body">
            <div className="col-12 slide-bar ">
              <div className="slid-com  col-10">
                <Link to={"/layout/account"}> Account </Link>
                <Link to={"/layout/blogs"}> Blogs</Link>
                <Link to={"/layout/wishlist"}> Wishlist</Link>
                {token ? (
                  <Link onClick={() => logout()}> Logout</Link>
                ) : (
                  <Link to={"/login"}> Login</Link>
                )}
                <Link to={"/layout/admin"}> post Blog</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="nav-main-con">
          <div className="inner-main-container">
            <div className="container nav-container">
              <div className="nav-heading-inner">
                <div className="row flex-row  ">
                  <div className="col-md-4 nav-social-icon">
                    <FaInstagram />
                    <FaFacebookF />
                    <FaYoutube />
                    <FaXTwitter />
                  </div>
                  <div className=" col-md-4 nav-heading">
                    <h1>CHRONIC</h1>
                    <p>Blogs and & Magzine</p>
                  </div>
                  <div className=" col-md-4 nav-account-whislist">
                    <Link to={"/layout/account"}>
                      {" "}
                      <VscAccount />{" "}
                    </Link>
                    <Link to={"/layout/wishlist"}>
                      {" "}
                      <PiHandbagLight />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="nav-com">
                <div className="nav-inner-com row">
                  <div className="col-md-2 col-6  m-0">
                    <Link>
                      <HiBars3BottomLeft
                        className="nav-bars  btn btn-primary "
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasExample"
                        aria-controls="offcanvasExample"
                      />{" "}
                    </Link>
                  </div>
                  <div className="col-md-8 m-0 nav-com-smaller">
                    <Link to={"/"} className="text-black">
                      {" "}
                      HOME{" "}
                    </Link>
                    <Link to={"/layout/contact"}> CONTACT </Link>
                    <Link to={"/layout/about"}> ABOUT </Link>
                    <Link to={"/layout/blog"}> Blogs </Link>
                    <select
                      className="form-select m-0 p-0 "
                      aria-label="Default select example"
                      onClick={(e) => val(e.target.value)}
                    >
                      <option value={""}>All</option>
                      {homecat.map((cat, index) => (
                        <option key={index} value={cat.category}>
                          {" "}
                          {cat.category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="serach-div col-md-2 col-6 m-0 ">
                    <Link>
                      <CiSearch
                        className="serach text-black"
                        onClick={() => showserach()}
                      />
                    </Link>
                  </div>

                  <div className="show-serach" ref={serachref}>
                    <input
                      type="text"
                      className="serach-input"
                      placeholder="Serach"
                      value={serach}
                      onChange={(e) => setSerach(e.target.value)}
                    />
                    <button className="serach-btn" onClick={() => showserach()}>
                      Serach
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <TopBarSlider />
      <div className="container">
        <div className="blogsection">
          <div className="main-blog-container container d-xl-flex ">
            {/* <div className="mai-blog-row row"> */}
            <div className="col-xl-8 blog-inner-container ">
              {filterblog.length > 0 ? (
                filterblog
                  .slice(pages * 12 - 12, pages * 12)
                  .map((blog, index) => {
                    return (
                      <div
                        key={index}
                        className=" cards  col-md-6 text-black text"
                      >
                        <div className="inner-card">
                          <button
                            className="bg-white border-0 "
                            onClick={() => wishlist(blog._id)}
                          >
                            {" "}
                            <FaBookmark className="bookmark-icon" />{" "}
                          </button>
                          <Link to={`/layout/specificblog/${blog._id}`}>
                            <img
                              src={`/uploads/${blog.image}`}
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
                              {new Date(
                                parseInt(blog.date)
                              ).toLocaleDateString()}
                            </p>
                            <button
                              className="like-home"
                              onClick={() => handleLike(blog._id)}
                            >
                              {" "}
                              <AiFillLike /> {blog.liked.length}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <p>there is no data </p>
              )}
            </div>
            {/* </div> */}



            {/* latest blog  */}

            
            <div className="col-xl-4 latest-blog  ">
              <div className="latest-inner-container">
                <h1 className="text-center">Latest Blog</h1>

                {blog.length > 0 ? (
                  blog.slice(pages * 7 - 7, pages * 7).map((blog, index) => {
                    return (
                      <div
                        key={index}
                        className="latest-cards   text-black text"
                      >
                        <div className=" latest-inner-card">
                          <Link to={`/layout/specificblog/${blog._id}`}>
                            <img
                              src={`http://localhost:8000/uploads/${blog.image}`}
                              alt="there is a image"
                            />
                            <div className="latest-card-content ">
                              <div
                                className="latest-card-heading"
                                dangerouslySetInnerHTML={{
                                  __html: DOMPurify.sanitize(
                                    blog.heading.slice(0, 50)
                                  ),
                                }}
                              ></div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>there is no data </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* footer is start from here */}
      <Footer />
    </>
  );
});

export default Home;

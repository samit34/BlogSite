import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { FaFacebookF } from "react-icons/fa";
import axios, { CancelToken } from "axios";

import "./navbar.css";
import { Link } from "react-router-dom";

import { FaInstagram } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";

// import { FaFacebookF } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { VscAccount } from "react-icons/vsc";
import { PiHandbagLight } from "react-icons/pi";
import { HiBars3BottomLeft } from "react-icons/hi2";
import { useAuth } from "../../Pages/Authcontext";

const Navbar = ({ setSerach, serach }) => {
  const serachref = useRef();
  const homeRef = useRef();
  const contactRef = useRef();
  const blogsRef = useRef();
  const aboutRef = useRef();
  const [homecat, setHomecat] = useState([]);
  const { logout } = useAuth();

  const token = localStorage.getItem("token");

  const showcom = (Ref) => {
    homeRef.current.classList.remove("nav-active");
    contactRef.current.classList.remove("nav-active");
    blogsRef.current.classList.remove("nav-active");
    aboutRef.current.classList.remove("nav-active");
    Ref.current.classList.toggle("nav-active");
  };

  const showserach = () => {
    serachref.current.classList.toggle("active-serach");
  };

  const val = (id) => {
    setSerach(id);
  };

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

  return (
    <>
      <nav>
        <div
          class="offcanvas offcanvas-start"
          tabindex="-1"
          id="offcanvasExample"
          aria-labelledby="offcanvasExampleLabel"
        >
          <div class="offcanvas-header">
            <h5 class="offcanvas-title text-white " id="offcanvasExampleLabel ">
              Offcanvas
            </h5>
            <button
              type="button"
              class="btn-close  bg-white text-white"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div class="offcanvas-body">
            {/* <div>
      Some text as placeholder. In real life you can have the elements you have chosen. Like, text, images, lists, etc.
    </div> */}
            <div className="col-12 slide-bar ">
              <div className="slid-com  col-10">
                <Link to={"/layout/account"}> Account </Link>
                <Link to={"/layout/blog"}> Blogs</Link>
                <Link to={"/layout/wishlist"}> Wishlist</Link>
                {token ? (
                  <Link onClick={() => logout()}> Logout</Link>
                ) : (
                  <Link onClick={() => logout()}> Login</Link>
                )}
                <Link to={"/layout/admin"}> Post Blog</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="nav-main-con">
          <div className="inner-main-container">
            <div className="container nav-container">
              <div className="nav-heading-inner">
                <div className="row">
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
                  <div className="col-md-2 col-6 m-0">
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

                  <div className="col-md-8 m-0 nav-com-smaller ">
                    <Link
                      to={"/"}
                      className=" com "
                      ref={homeRef}
                      onClick={() => showcom(homeRef)}
                    >
                      {" "}
                      HOME{" "}
                    </Link>
                    <Link
                      to={"/layout/contact"}
                      className=" com "
                      ref={contactRef}
                      onClick={() => showcom(contactRef)}
                    >
                      {" "}
                      CONTACT{" "}
                    </Link>
                    <Link
                      to={"/layout/about"}
                      className=" com "
                      ref={aboutRef}
                      onClick={() => showcom(aboutRef)}
                    >
                      {" "}
                      ABOUT{" "}
                    </Link>
                    <Link
                      to={"/layout/blog"}
                      className=" com "
                      ref={blogsRef}
                      onClick={() => showcom(blogsRef)}
                    >
                      {" "}
                      Blogs{" "}
                    </Link>
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
                  <div className=" serach-div col-md-2 col-6 m-0 ">
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
    </>
  );
};

export default Navbar;

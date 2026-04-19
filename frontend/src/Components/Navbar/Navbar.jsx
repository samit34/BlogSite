import React, { useCallback, useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { FaFacebookF } from "react-icons/fa";
import api from "../../api/client";
import listFromResponse from "../../api/listFromResponse";

import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";

import { FaInstagram } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";

import { FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { VscAccount } from "react-icons/vsc";
import { PiHandbagLight } from "react-icons/pi";
import { HiBars3BottomLeft } from "react-icons/hi2";
import { useAuth } from "../../Pages/Authcontext";

const Navbar = ({ setSerach = () => {}, serach = "" }) => {
  const serachref = useRef();
  const homeRef = useRef();
  const contactRef = useRef();
  const blogsRef = useRef();
  const aboutRef = useRef();
  const [homecat, setHomecat] = useState([]);
  const { logout, isauth } = useAuth();
  const navigate = useNavigate();

  const categoryOptions = homecat.map((c) => c.category).filter(Boolean);
  const selectedCategory =
    serach === "" || categoryOptions.includes(serach) ? serach : "";

  const handleCategoryChange = useCallback(
    (event) => {
      setSerach(event.target.value);
    },
    [setSerach]
  );

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

  useEffect(() => {
    api
      .get("/user/homecategory")
      .then((res) => {
        setHomecat(listFromResponse(res));
      })
      .catch((err) => {
        console.log("this is a err in navbar", err);
      });
  }, []);

  return (
    <nav className="navbar-chronic" aria-label="Main">
      <div
        className="offcanvas offcanvas-start"
        tabIndex={-1}
        id="offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div className="offcanvas-header navbar-chronic__drawer-header">
          <div>
            <p className="navbar-chronic__drawer-kicker">Chronic</p>
            <h2
              className="offcanvas-title text-white h5 mb-0"
              id="offcanvasExampleLabel"
            >
              Menu
            </h2>
          </div>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
        <div className="offcanvas-body navbar-chronic__drawer-body">
          <div className="col-12 slide-bar">
            <div className="slid-com col-10">
              <Link className="navbar-chronic__drawer-link" to="/layout/account">
                Account
              </Link>
              <Link className="navbar-chronic__drawer-link" to="/layout/blog">
                Blogs
              </Link>
              <Link className="navbar-chronic__drawer-link" to="/layout/wishlist">
                Wishlist
              </Link>
              <Link className="navbar-chronic__drawer-link" to="/layout/about">
                About
              </Link>
              <Link className="navbar-chronic__drawer-link" to="/layout/contact">
                Contact
              </Link>
              {isauth ? (
                <button
                  type="button"
                  className="sidebar-auth-btn"
                  data-bs-dismiss="offcanvas"
                  onClick={() => logout()}
                >
                  Logout
                </button>
              ) : (
                <button
                  type="button"
                  className="sidebar-auth-btn"
                  data-bs-dismiss="offcanvas"
                  aria-label="Sign in"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              )}
              <Link className="navbar-chronic__drawer-link" to="/layout/admin">
                Post Blog
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="nav-main-con">
        <div className="inner-main-container">
          <div className="container nav-container">
            <div className="nav-heading-inner">
              <div className="row align-items-center">
                <div className="col-md-4 nav-social-icon">
                  <FaInstagram aria-hidden />
                  <FaFacebookF aria-hidden />
                  <FaYoutube aria-hidden />
                  <FaXTwitter aria-hidden />
                </div>

                <div className="col-md-4 nav-heading">
                  <h1>CHRONIC</h1>
                  <p>Blogs &amp; magazine</p>
                </div>

                <div className="col-md-4 nav-account-whislist">
                  <Link
                    to="/layout/account"
                    className="navbar-chronic__icon-link"
                    aria-label="Account"
                  >
                    <VscAccount aria-hidden />
                  </Link>
                  <Link
                    to="/layout/wishlist"
                    className="navbar-chronic__icon-link"
                    aria-label="Wishlist"
                  >
                    <PiHandbagLight aria-hidden />
                  </Link>
                </div>
              </div>
            </div>

            <div className="nav-com">
              <div className="nav-inner-com row align-items-center">
                <div className="col-md-2 col-6 m-0">
                  <button
                    type="button"
                    className="navbar-chronic__menu-btn"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasExample"
                    aria-controls="offcanvasExample"
                    aria-label="Open menu"
                  >
                    <HiBars3BottomLeft className="nav-bars" aria-hidden />
                  </button>
                </div>

                <div className="col-md-8 m-0 nav-com-smaller">
                  <Link
                    to="/"
                    className="navbar-chronic__link"
                    ref={homeRef}
                    onClick={() => showcom(homeRef)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/layout/contact"
                    className="navbar-chronic__link"
                    ref={contactRef}
                    onClick={() => showcom(contactRef)}
                  >
                    Contact
                  </Link>
                  <Link
                    to="/layout/about"
                    className="navbar-chronic__link"
                    ref={aboutRef}
                    onClick={() => showcom(aboutRef)}
                  >
                    About
                  </Link>
                  <Link
                    to="/layout/blog"
                    className="navbar-chronic__link"
                    ref={blogsRef}
                    onClick={() => showcom(blogsRef)}
                  >
                    Blogs
                  </Link>
                  <select
                    className="nav-category-select"
                    aria-label="Filter by category"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                  >
                    <option value="">All</option>
                    {homecat.map((cat, index) => (
                      <option
                        key={cat._id || cat.category || index}
                        value={cat.category}
                      >
                        {cat.category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="serach-div col-md-2 col-6 m-0">
                  <button
                    type="button"
                    className="navbar-chronic__search-btn"
                    onClick={() => showserach()}
                    aria-label="Open search"
                  >
                    <CiSearch className="serach" aria-hidden />
                  </button>
                </div>
                <div className="show-serach" ref={serachref} role="search">
                  <label htmlFor="layout-nav-search" className="navbar-chronic__search-label">
                    Search
                  </label>
                  <input
                    id="layout-nav-search"
                    type="search"
                    className="serach-input"
                    placeholder="Search…"
                    value={serach}
                    onChange={(e) => setSerach(e.target.value)}
                  />
                  <div className="navbar-chronic__search-actions">
                    <button
                      type="button"
                      className="serach-btn serach-btn--primary"
                      onClick={() => showserach()}
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

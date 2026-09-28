import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/client";
import listFromResponse from "../../api/listFromResponse";
import "react-quill/dist/quill.snow.css";
import "./Home.css";
import "./home-page.css";
import "../../Components/Navbar/navbar.css";
import { useBlog } from "../Blogcontext";

import { CiSearch } from "react-icons/ci";

import { FaInstagram } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { VscAccount } from "react-icons/vsc";
import { PiHandbagLight } from "react-icons/pi";
import HeroSection from "../../Components/editorial/HeroSection";
import FeaturedSlider from "../../Components/editorial/FeaturedSlider";
import PinSlider from "../../Components/editorial/PinSlider";
import PinScrollList from "../../Components/editorial/PinScrollList";
import LatestBlogs from "../../Components/editorial/LatestBlogs";
import { HiBars3BottomLeft } from "react-icons/hi2";
import { useAuth } from "../Authcontext";
import Footer from "../../Components/footer/Footer";
import { useNavScroll, useElementHeight } from "../../hooks/useNavScroll";
import { HomeSkeleton } from "../../Components/Loader/PageLoader";
import BrandLogo from "../../Components/BrandLogo/BrandLogo";

const Home = React.memo(() => {
  const serachref = useRef(null);
  const barRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  const { logout, isauth } = useAuth();
  const navigate = useNavigate();
  const hidden = useNavScroll({ locked: searchOpen });
  const barHeight = useElementHeight(barRef);

  const hasFilters = Boolean(
    String(searchQuery).trim() || String(categoryFilter).trim()
  );

  const showserach = () => {
    setSearchOpen((o) => !o);
  };

  useEffect(() => {
    const el = serachref.current;
    if (!el) return;
    el.classList.toggle("active-serach", searchOpen);
    if (searchOpen) {
      requestAnimationFrame(() => searchInputRef.current?.focus());
    }
  }, [searchOpen]);

  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape" && searchOpen) setSearchOpen(false);
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [searchOpen]);

  const { fetchBlogs, blog, blogsLoading } = useBlog();
  const [homecat, setHomecat] = useState([]);

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

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return (
    <>
      <nav
        className={`home-nav-shell navbar-chronic${
          hidden ? " navbar-chronic--hidden" : ""
        }`}
      >
        <div
          className="offcanvas offcanvas-start"
          tabIndex={-1}
          id="offcanvasExample"
          aria-labelledby="offcanvasExampleLabel"
        >
          <div className="offcanvas-header navbar-chronic__drawer-header">
            <BrandLogo invert withTagline={false} size="sm" />
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            />
          </div>
          <div className="offcanvas-body navbar-chronic__drawer-body">
            <div className="col-12 slide-bar ">
              <div className="slid-com  col-10">
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
                  Post a story
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="nav-main-con" ref={barRef}>
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
                    <BrandLogo />
                  </div>
                  <div className=" col-md-4 nav-account-whislist">
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
                  <div className="col-md-2 col-6  m-0">
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
                    <Link to={"/"} className="home-nav-link">
                      Home
                    </Link>
                    <Link to={"/layout/contact"} className="home-nav-link">
                      Contact
                    </Link>
                    <Link to={"/layout/about"} className="home-nav-link">
                      About
                    </Link>
                    <Link to={"/layout/blog"} className="home-nav-link">
                      Archive
                    </Link>
                    <select
                      className="nav-category-select"
                      aria-label="Filter by category"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <option value="">All categories</option>
                      {homecat.map((cat, index) => (
                        <option
                          key={cat._id || cat.category || index}
                          value={cat.category}
                        >
                          {cat.category}
                        </option>
                      ))}
                    </select>
                    {hasFilters ? (
                      <button
                        type="button"
                        className="nav-clear-filters"
                        onClick={() => {
                          setSearchQuery("");
                          setCategoryFilter("");
                        }}
                      >
                        Clear filters
                      </button>
                    ) : null}
                  </div>
                  <div className="serach-div col-md-2 col-6 m-0 ">
                    <button
                      type="button"
                      className="navbar-chronic__search-btn"
                      aria-expanded={searchOpen}
                      onClick={showserach}
                    >
                      <CiSearch className="serach" aria-hidden />
                      <span className="visually-hidden">Open search</span>
                    </button>
                  </div>

                  <div
                    className="show-serach"
                    ref={serachref}
                    role="search"
                  >
                    <label htmlFor="home-search-input" className="nav-search-label">
                      Search posts
                    </label>
                    <input
                      id="home-search-input"
                      ref={searchInputRef}
                      type="search"
                      className="serach-input"
                      placeholder="Search titles & stories…"
                      autoComplete="off"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          setSearchOpen(false);
                        }
                      }}
                    />
                    <div className="nav-search-actions">
                      <button
                        type="button"
                        className="serach-btn serach-btn--primary"
                        onClick={() => setSearchOpen(false)}
                      >
                        Done
                      </button>
                      {hasFilters ? (
                        <button
                          type="button"
                          className="serach-btn serach-btn--ghost"
                          onClick={() => {
                            setSearchQuery("");
                            setCategoryFilter("");
                            setSearchOpen(false);
                          }}
                        >
                          Clear all
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div
        className="navbar-chronic__spacer"
        style={{ height: barHeight ? `${barHeight}px` : undefined }}
        aria-hidden
      />

      <HeroSection />

      {blogsLoading ? (
        <HomeSkeleton />
      ) : (
        <>
          <LatestBlogs />
          <FeaturedSlider posts={blog} />
          <PinSlider posts={blog} />
          <PinScrollList />
        </>
      )}

      <Footer />
    </>
  );
});

export default Home;

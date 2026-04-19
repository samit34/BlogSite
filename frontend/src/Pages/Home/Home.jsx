import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { API_BASE_URL } from "../../api/client";
import listFromResponse from "../../api/listFromResponse";
import "react-quill/dist/quill.snow.css";
import "./Home.css";
import "./home-page.css";
import "../../Components/Navbar/navbar.css";
import DOMPurify from "dompurify";
import { AiFillLike } from "react-icons/ai";
import { useBlog } from "../Blogcontext";

import { CiSearch } from "react-icons/ci";

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
import {
  ScrollReveal,
  ScrollRevealWide,
} from "../../Components/motion/ScrollReveal";
import { useToast } from "../../Components/Toast/ToastProvider";
import { addToWishlistWithToast } from "../../utils/wishlistNotify";
import PageLoader from "../../Components/Loader/PageLoader";
import EmptyState from "../../Components/EmptyState/EmptyState";
import { filterPosts } from "../../utils/filterPosts";

const FEED_PAGE = 12;
const LATEST_COUNT = 7;

const Home = React.memo(() => {
  const serachref = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  const { logout, isauth } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

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

  const { fetchBlogs, handleLike, blog, blogsLoading } = useBlog();
  const [homecat, setHomecat] = useState([]);
  const [feedPage] = useState(1);

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

  const wishlist = (id) => {
    addToWishlistWithToast(api, id, showToast);
  };

  const filterblog = filterPosts(blog, { searchQuery, categoryFilter });

  const feedSlice = filterblog.slice(
    feedPage * FEED_PAGE - FEED_PAGE,
    feedPage * FEED_PAGE
  );

  const latestStories = useMemo(() => {
    if (!Array.isArray(blog) || blog.length === 0) return [];
    return [...blog]
      .sort((a, b) => {
        const da = parseInt(String(a?.date ?? ""), 10) || 0;
        const db = parseInt(String(b?.date ?? ""), 10) || 0;
        return db - da;
      })
      .slice(0, LATEST_COUNT);
  }, [blog]);

  return (
    <>
      <nav className="home-nav-shell navbar-chronic">
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
                    <p>Blogs &amp; magazine</p>
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

      <ScrollRevealWide>
        <TopBarSlider />
      </ScrollRevealWide>

      <main
        className={`home-page${
          searchOpen || hasFilters ? " home-page--searching" : ""
        }`}
      >
        <div className="container home-page__inner">
          <header className="home-page__intro">
            <p className="home-page__kicker">Magazine</p>
            <h2 className="home-page__title">Stories worth your attention</h2>
            <p className="home-page__lede">
              Browse the feed or open the archive—filter by topic and search
              across every post.
            </p>
          </header>

          <div className="blogsection">
            {blogsLoading ? (
              <PageLoader message="Loading stories" />
            ) : (
              <div className="row g-4 home-page__layout">
                <div className="col-xl-8 order-2 order-xl-1">
                  <div className="row g-4 home-feed">
                    {feedSlice.length > 0 ? (
                      feedSlice.map((post, index) => (
                        <ScrollReveal
                          key={post._id || index}
                          className="col-12 col-md-6 home-feed__col"
                          delay={Math.min(index * 0.06, 0.54)}
                        >
                          <article className="home-card">
                            <button
                              type="button"
                              className="home-card__bookmark"
                              onClick={() => wishlist(post._id)}
                              aria-label="Save to wishlist"
                            >
                              <FaBookmark />
                            </button>
                            <Link
                              className="home-card__link"
                              to={`/layout/specificblog/${post._id}`}
                            >
                              <div className="home-card__media">
                                <img
                                  src={`${API_BASE_URL}/uploads/${post.image}`}
                                  alt=""
                                />
                              </div>
                              <div className="home-card__body">
                                <span className="home-card__cat">
                                  {post.category}
                                </span>
                                <div
                                  className="home-card__title"
                                  dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                      post.heading.slice(0, 120)
                                    ),
                                  }}
                                />
                                <span className="home-card__read">
                                  Read article →
                                </span>
                              </div>
                            </Link>
                            <div className="home-card__footer">
                              <span>By {post.username}</span>
                              <span>
                                {new Date(
                                  parseInt(post.date)
                                ).toLocaleDateString()}
                              </span>
                              <button
                                type="button"
                                className="home-card__like"
                                onClick={() => handleLike(post._id)}
                              >
                                <AiFillLike /> {post.liked.length}
                              </button>
                            </div>
                          </article>
                        </ScrollReveal>
                      ))
                    ) : blog.length === 0 ? (
                      <div className="col-12">
                        <EmptyState
                          title="No posts yet"
                          hint="There are no stories to show right now. Please check back soon—new pieces appear here as soon as they are published."
                          className="empty-state--wide"
                        />
                      </div>
                    ) : (
                      <div className="col-12">
                        <EmptyState
                          title="No matching stories"
                          hint="Nothing matches your filters. Clear category or search above, or try different keywords."
                          className="empty-state--wide"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <aside
                  className="col-xl-4 home-latest order-1 order-xl-2"
                  aria-label="Latest stories"
                >
                  <div className="home-latest__sticky">
                    <h2 className="home-latest__heading">Latest blog</h2>
                    <p className="home-latest__sub">Newest posts first</p>
                    {latestStories.length > 0 ? (
                      <ul className="home-latest__list">
                        {latestStories.map((item, index) => (
                          <li key={item._id || index} className="home-latest__row">
                            <Link
                              to={`/layout/specificblog/${item._id}`}
                              className="home-latest__item"
                            >
                              <div className="home-latest__thumb">
                                <img
                                  src={`${API_BASE_URL}/uploads/${item.image}`}
                                  alt=""
                                />
                              </div>
                              <div className="home-latest__text">
                                <span className="home-latest__cat">
                                  {item.category}
                                </span>
                                <div
                                  className="home-latest__headline"
                                  dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                      item.heading.slice(0, 80)
                                    ),
                                  }}
                                />
                              </div>
                            </Link>
                            <button
                              type="button"
                              className="home-latest__like"
                              onClick={() => handleLike(item._id)}
                              aria-label={`Like (${Array.isArray(item.liked) ? item.liked.length : 0})`}
                            >
                              <AiFillLike aria-hidden />
                              <span>
                                {Array.isArray(item.liked) ? item.liked.length : 0}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <EmptyState
                        title="No latest posts"
                        hint="When new articles are published, they will appear here."
                        className="empty-state--compact"
                      />
                    )}
                    <Link to="/layout/blog" className="home-latest__cta">
                      Full archive →
                    </Link>
                  </div>
                </aside>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
});

export default Home;

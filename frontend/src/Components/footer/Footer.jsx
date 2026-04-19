import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import { ScrollRevealWide } from "../motion/ScrollReveal";

const Footer = () => {
  return (
    <ScrollRevealWide>
      <section className="footer-section">
        <div className="footer-inner">
          <footer className="footer-main">
            <div className="container">
              <div className="row footer-grid">
                <div className="col-lg-4 col-md-6 footer-col footer-col--brand">
                  <p className="footer-kicker">Chronic</p>
                  <h2 className="footer-heading">Get in touch</h2>
                  <p className="footer-text">Mohali, Punjab — Sector 8B</p>
                  <p className="footer-text">
                    <a href="tel:+918725978774">+91 87259 78774</a>
                  </p>
                  <p className="footer-text">
                    <a href="mailto:samitdhiman0001@gmail.com">
                      samitdhiman0001@gmail.com
                    </a>
                  </p>
                </div>

                <div className="col-lg-2 col-md-6 footer-col">
                  <h3 className="footer-subheading">Navigate</h3>
                  <nav className="footer-nav" aria-label="Footer primary">
                    <Link to="/">Home</Link>
                    <Link to="/layout/blog">Blog</Link>
                    <Link to="/layout/about">About</Link>
                    <Link to="/layout/contact">Contact</Link>
                  </nav>
                </div>

                <div className="col-lg-3 col-md-6 footer-col">
                  <h3 className="footer-subheading">Your account</h3>
                  <nav className="footer-nav" aria-label="Footer account">
                    <Link to="/layout/account">Account</Link>
                    <Link to="/layout/wishlist">Wishlist</Link>
                    <Link to="/layout/admin">Post a story</Link>
                  </nav>
                </div>

                <div className="col-lg-3 col-md-6 footer-col">
                  <h3 className="footer-subheading">About Chronic</h3>
                  <p className="footer-blurb">
                    Stories, essays, and magazine-style features—one place to
                    read, save favorites, and share what matters. Built as a
                    full-stack blog platform for curious readers and writers.
                  </p>
                </div>
              </div>

              <hr className="footer-rule" />

              <div className="footer-bottom">
                <p className="footer-copy">
                  © {new Date().getFullYear()}{" "}
                  <span className="footer-brand-name">Chronic</span>
                  <span className="footer-copy-muted">
                    {" "}
                    · Blogs &amp; magazine
                  </span>
                </p>
                <p className="footer-credit">
                  Made by{" "}
                  <span className="footer-credit-name">Samit Dhiman</span>
                </p>
              </div>
            </div>
          </footer>
        </div>
      </section>
    </ScrollRevealWide>
  );
};

export default Footer;

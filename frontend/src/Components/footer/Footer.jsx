import React from "react";
import "./Footer.css"; 
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <section className="section-seventeen  ">
      <div className="inner-seventeen ">
        <footer>
          <div className="container">
            <div className="row">
              <div className="col-xl-4  col-one box">
                <h2>Contact</h2>
                <p> Punjab  </p>
                <p>Mohali, Sector : 8B  </p>
                <p>Phone: +91 8725978774</p>
                <p>Email: samitdhiman0001@gmail.com</p>
              </div>
              <div className="col-xl-2 m-xl-0 mt-3 col-two box">
                <h4>Useful Links</h4>
                <div className="footer-header">
                <Link to={'/'}>Home</Link>
                <Link to={'/layout/about'} >About us</Link>
                <Link to={'/layout/wishlist'} >Account</Link>
                <Link to={'/layout/wishlsit'} >Wishlist</Link>
                <Link to={'/layout/contact'} >Contact us</Link>
                </div>
              </div>
              <div className="col-xl-2 m-xl-0 mt-3 col-two box">
                <h4> Feature</h4>
                <div className="footer-header">
                <Link>Web Design</Link>
                <Link>Web Development</Link>
                <Link>Product Management</Link>
                <Link>Marketing</Link>
                <Link>Graphic Design</Link>
                </div>
              </div>
              <div className="col-xl-4 col-two m-xl-0 mt-3 box">
                <h4>About us </h4>
                <div className="">
                 
                  <div className="my-info">
                    
                    <p className="text-white bg-black " >This website is the first project created by Samit Dhiman. It is a versatile blog platform where users can post blogs on a variety of topics and genres. Whether you are passionate about technology, lifestyle, travel, or anything in between, this site is here for you.</p>
                    
                  </div>
                </div>
                
              </div>
            </div>
            <hr />
            <div className="row last-row  box">
              <div className="last-div">
                <p>
                  © <span>Copyright</span>
                  <strong className="px-1 sitename">Blog</strong>
                  <span>Thanks for visiting</span>
                </p>
                <div className="credits">
                  Designed by <span style={{ fontWeight: 400, color: "#3444bc" }}>Samit Dhiman</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Footer;



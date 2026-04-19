import { Routes, Route } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar";
// import Home from '../Pages/Home/Home';
import { useAuth } from "../Pages/Authcontext";
import Admin from "../Pages/Admin/Admin";
import Superadmin from "./Superadmin.jsx/Superadmin";
import Specificblog from "./Specificblog/Specificblog";
import Wishlist from "./Wishlist/Wishlist";
import Accountpage from "./Accontpage/Accontpage";
import Blogcontext from "./Blogcontext";
import { useState } from "react";
import Contact from "./Contact/Contact";
import Footer from "../Components/footer/Footer";
import About from "./About/About";
import { useNavigate } from "react-router-dom";
import Blog from "../Pages/Blog/Blog";
import Privateroute from "./Privateroute";
import PageLoader from "../Components/Loader/PageLoader";

const Layout = () => {
  const navigate = useNavigate();

  const { isauth, loading } = useAuth();

  const [serach, setSerach] = useState("");

  const val = (key) => {
    setSerach(key);
  };

  if (loading) {
    return (
      <PageLoader message="Checking your session" fullScreen />
    );
  }

  console.log("the value of isauth in layout", isauth);

  return (
    <>
      <Navbar setSerach={setSerach} serach={serach} val={val} />
      {isauth ? (
        <Blogcontext>
          <Routes>
            <Route
              path="/superadmin"
              element={
                <Privateroute requiredrole="admin">
                  <Superadmin />
                </Privateroute>
              }
            />
            <Route path="/admin" element={<Admin />} />
            <Route path="/specificblog/:id" element={<Specificblog />} />

            <Route
              path="/wishlist"
              element={<Wishlist serach={serach} />}
            />
            <Route path="/account" element={<Accountpage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog serach={serach} />} />
          </Routes>
        </Blogcontext>
      ) : (
        navigate("/login")
      )}
      <Footer />
    </>
  );
};

export default Layout;

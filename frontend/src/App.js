import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./Pages/Authcontext";
import Privateroute from "./Pages/Privateroute";
import Layout from "./Pages/Layout";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/Signup";
import BlogContextProvider from "./Pages/Blogcontext";
import Home from "./Pages/Home/Home";
import Specificblog from "./Pages/Specificblog/Specificblog";
import Block from "./Pages/Block";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Blog from "./Pages/Blog/Blog";

function App() {
  console.log("the app.js is re-render ");

  return (
    <Router>
      <AuthProvider>
        <BlogContextProvider>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Home />} />
            <Route path="/layout/specificblog/:id" element={<Specificblog />} />
            <Route path="/blog" element={<Blog />} />

            <Route path="/block" element={<Block />} />
            {/* Protected Route */}

            <Route
              path="/layout/*"
              element={
                <Privateroute>
                  <Layout />
                </Privateroute>
              }
            />
          </Routes>
        </BlogContextProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

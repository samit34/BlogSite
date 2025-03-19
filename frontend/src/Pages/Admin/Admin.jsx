import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import './Admin.css';



const Admin = () => {
    const [heading, setHeading] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState("");
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]); // Store fetched categories
    const [eyecatch, setEyecatch] = useState("")
    // const [showCategoryInput, setShowCategoryInput] = useState(false); // Toggle input panel






    // Fetch categories from the database
    useEffect(() => {

        const token = localStorage.getItem('token');
        axios
            .get('https://blogsite-208j.onrender.com/user/showcategories', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }) // Endpoint to fetch categories   
            .then((res) => {
                setCategories(res.data);
                console.log("the useeffect is getting the response");

            })
            .catch((err) => console.log("the use effect funcation error is here", err));
    }, []);





    const photohandle = (e) => {
        setImage(e.target.files[0]);
    };

    const handleCategorySelect = (e) => {
        setCategory(e.target.textContent);
    };

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("content", content);
        formData.append("heading", heading);
        formData.append("category", category);
        formData.append("eyecatch", eyecatch);



        const token = localStorage.getItem('token');

        axios
            .post('https://blogsite-208j.onrender.com/user/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                }
            })
            .then((res) => {
                console.log(res)
                window.location.reload();
            })
            .catch((err) => console.log(err));
    };

    const headingModules = {
        toolbar: [
            [{ 'bold': true }] // Only allow bold formatting
        ],
    };

    const modules = {
        toolbar: [
            [{ header: '1' }, { header: '2' }, { font: [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean'],
        ],
    };





    return (
        <>

        


            <div className='sec-admin ' >
            <div className="blog-page-heading"><h1>ADD YOUR BLOG</h1></div>
                <div className="admin d-flex flex-column justify-content-center align-items-center gap-2">

                    <div className='photo-admin ' >
                        <h1 className='text-black'>Add photo</h1>
                        {/* File Input */}
                        <input
                            type="file"
                            className="blog-heading-input"
                            onChange={photohandle}       
                            placeholder="Choose your file"
                        />
                    </div>

                    <div className='heading-admin'>
                        <h1 className="text-black">Heading</h1>
                        <ReactQuill
                            theme="snow"
                            value={heading}
                            onChange={(value) => {
                                const headingText = value.replace(/<[^>]*>/g, ""); // Strip HTML tags
                                if (headingText.length <= 50) {
                                    setHeading(value); // Update only if character limit is not exceeded
                                } else {
                                    // Truncate input at 200 characters
                                    const trunheading = headingText.slice(0, 50);
                                    setHeading(trunheading); // Update with truncated value
                                }
                            }}
                            modules={{ toolbar: false }}
                            placeholder="Write your eyecatch here..."
                            style={{ overflow: "hidden" }} // Fix height and prevent scrolling
                        />
                        <div className='text-black' style={{ marginTop: "10px", textAlign: "right", fontSize: "14px" }}>
                            {heading.replace(/<[^>]*>/g, "").length}/50 characters
                        </div>
                    </div>




                    <div className='thumnail-admin'>
                        <h1 className="text-black">Thumnail</h1>
                        <ReactQuill
                            theme="snow"
                            value={eyecatch}
                            onChange={(value) => {
                                const plainText = value.replace(/<[^>]*>/g, ""); // Strip HTML tags
                                if (plainText.length <= 70) {
                                    setEyecatch(value); // Update only if character limit is not exceeded
                                } else {
                                    // Truncate input at 200 characters
                                    const truncated = plainText.slice(0, 70);
                                    setEyecatch(truncated); // Update with truncated value
                                }
                            }}
                            modules={{ toolbar: false }} // Disable toolbar
                            placeholder="Write your eyecatch here..."
                            style={{ height: "100px", overflow: "hidden" }} // Fix height and prevent scrolling
                        />
                        <div  className='text-black'  style={{ marginTop: "10px", textAlign: "right", fontSize: "14px" }}>
                            {eyecatch.replace(/<[^>]*>/g, "").length}/70 characters
                        </div>
                    </div>






                    {/* Rich Text Editor for Blog Content */}

                    <div className='admin-blog'  >
                        <h1 className='text-black' >Write your blog over here</h1>
                        <ReactQuill
                            theme="snow"
                            value={content}
                            onChange={setContent}
                            modules={modules}
                            placeholder="Write your blog here..."

                        />
                    </div>

                    {/* Dropdown for Category */}
                    <div className="dropdown">
                        <button
                            className="admint-btn-cat"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            {category || "Select Category"}
                        </button>
                        <ul className="dropdown-menu">
                            {categories.map((cat, index) => (
                                <li key={index}>
                                    <a
                                        className="dropdown-item"
                                        onClick={handleCategorySelect}

                                    >
                                        {cat.category}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>



                    <button type='submit' className="post-btn" onClick={handleSubmit}>
                        post
                    </button>
                </div>
            </div>
        </>
    );
};

export default Admin;

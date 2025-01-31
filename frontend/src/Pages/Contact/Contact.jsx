// import React from "react";
// import "./Contact.css";
// import samit from "../../images/blog.webp"
// const Contact = () => {
//   return (
//     <div className="contact-container">
//       <div className="contact-left">
//         <img
//           src={samit}
//           alt="Contact Illustration"
//           className="contact-image"
//         />
//       </div>
//       <div className="contact-right">
//         <h1>Contact Us</h1>
//         <form className="contact-form">
//           <label htmlFor="name" className="form-label">
//             Name <span className="required">*</span>
//           </label>
//           <div className="name-fields">
//             <input
//               type="text"
//               id="first-name"
//               placeholder="First"
//               className="input-field"
//               required
//             />
//             <input
//               type="text"
//               id="last-name"
//               placeholder="Last"
//               className="input-field"
//               required
//             />
//           </div>

//           <label htmlFor="email" className="form-label">
//             Email <span className="required">*</span>
//           </label>
//           <input
//             type="email"
//             id="email"
//             placeholder="Enter your email"
//             className="input-field full-width"
//             required
//           />

//           <label htmlFor="message" className="form-label">
//             Leave us a few words <span className="required">*</span>
//           </label>
//           <textarea
//             id="message"
//             placeholder="Write your message here..."
//             className="textarea-field"
//             required
//           ></textarea>

//           <button type="submit" className="submit-button">
//             SUBMIT
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Contact;


import React, { useState } from "react";
import axios from "axios";
import './Contact.css'
import samit from "../../images/blog.webp";

const Contact = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      firstName,
      lastName,
      email,
      message
    };

    console.log("formate data", formData )

    try {
      // Using axios to make the POST request to the backend
      const response = await axios.post("http://localhost:8000/user/email", formData);
      
      if (response.status === 200) {
        alert("Message sent successfully!");
      } else {
        alert("Error sending message.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error sending message.");
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-left">
        <img src={samit} alt="Contact Illustration" className="contact-image" />
      </div>
      <div className="contact-right">
        <h1>Contact Us</h1>
        <form className="contact-form" onSubmit={handleSubmit}>
          <label htmlFor="first-name" className="form-label">
            Name <span className="required">*</span>
          </label>
          <div className="name-fields">
            <input
              type="text"
              id="first-name"
              placeholder="First"
              className="input-field"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              id="last-name"
              placeholder="Last"
              className="input-field"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <label htmlFor="email" className="form-label">
            Email <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            className="input-field full-width"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="message" className="form-label">
            Leave us a few words <span className="required">*</span>
          </label>
          <textarea
            id="message"
            placeholder="Write your message here..."
            className="textarea-field"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>

          <button type="submit" className="submit-button">
            SUBMIT
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;

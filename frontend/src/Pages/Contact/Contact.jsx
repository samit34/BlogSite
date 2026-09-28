import React, { useState } from "react";
import api from "../../api/client";
import "./Contact.css";
import "../../Components/editorial/editorial.css";
import { ScrollReveal } from "../../Components/motion/ScrollReveal";
import { motion } from "motion/react";
import { FaEnvelope, FaPaperPlane, FaPhone } from "react-icons/fa";
import { useToast } from "../../Components/Toast/ToastProvider";

/** Display-only placeholders (not real contact details). */
const CONTACT_DISPLAY = {
  email: "hello@chronicmagazine.studio",
  emailHref: "mailto:hello@chronicmagazine.studio",
  phone: "+1 (555) 284-0193",
  phoneHref: "tel:+15552840193",
  address: "Studio 7 · 442 Maple Row · Riverton, OR 97209",
};

const Contact = () => {
  const { showToast } = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    const formData = { firstName, lastName, email, message };

    try {
      const response = await api.post("/user/email", formData);
      if (response.status === 200) {
        showToast("Message sent. Thank you.", "success");
        setFirstName("");
        setLastName("");
        setEmail("");
        setMessage("");
      } else {
        showToast("Something went wrong. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast(
        "Could not send your message. Check your connection and try again.",
        "error"
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="sq-about-hero">
        <img src="/editorial/desk.jpg" alt="" />
        <div className="sq-about-hero__veil" aria-hidden />
        <div className="sq-about-hero__inner">
          <p className="sq-kicker" style={{ color: "rgba(250,247,240,0.75)" }}>
            Letters
          </p>
          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            Get in touch
          </motion.h1>
          <motion.p
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            Questions, pitches, or a quiet note—send a letter and we will write
            back when we can.
          </motion.p>
        </div>
      </section>

      <section className="sq-about-split">
        <motion.img
          src="/editorial/studio.jpg"
          alt=""
          initial={{ opacity: 0, scale: 1.04 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1 }}
        />
        <div className="sq-about-split__copy">
          <p className="sq-kicker">Direct lines</p>
          <h2>The desk is open.</h2>
          <p>
            For story ideas, corrections, or partnerships, use the form below or
            reach the studio on these lines.
          </p>
          <ul className="contact-lines">
            <li>
              <FaEnvelope aria-hidden />
              <a href={CONTACT_DISPLAY.emailHref}>{CONTACT_DISPLAY.email}</a>
            </li>
            <li>
              <FaPhone aria-hidden />
              <a href={CONTACT_DISPLAY.phoneHref}>{CONTACT_DISPLAY.phone}</a>
            </li>
          </ul>
          <p className="contact-address">{CONTACT_DISPLAY.address}</p>
        </div>
      </section>

      <div className="contact-page__form-wrap">
        <div className="container contact-page__inner">
          <ScrollReveal>
            <header className="contact-page__hero">
              <p className="contact-page__kicker">Write to us</p>
              <h2 className="contact-page__title">Send a message</h2>
              <p className="contact-page__lede">
                All fields are required. We read every note that arrives.
              </p>
            </header>

            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <label htmlFor="first-name" className="contact-label">
                Name
              </label>
              <div className="contact-name-row">
                <input
                  type="text"
                  id="first-name"
                  placeholder="First name"
                  className="contact-input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  autoComplete="given-name"
                />
                <input
                  type="text"
                  id="last-name"
                  placeholder="Last name"
                  className="contact-input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  autoComplete="family-name"
                />
              </div>

              <label htmlFor="email" className="contact-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                className="contact-input contact-input--full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />

              <label htmlFor="message" className="contact-label">
                Message
              </label>
              <textarea
                id="message"
                placeholder="Tell us what’s on your mind…"
                className="contact-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={6}
              />

              <button
                type="submit"
                className="contact-submit"
                disabled={sending}
              >
                {sending ? (
                  "Sending…"
                ) : (
                  <>
                    <FaPaperPlane aria-hidden /> Send message
                  </>
                )}
              </button>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export default Contact;

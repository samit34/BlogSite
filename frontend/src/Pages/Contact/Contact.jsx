import React, { useState } from "react";
import api from "../../api/client";
import "./Contact.css";
import samit from "../../images/blog.webp";
import { ScrollReveal, ScrollRevealWide } from "../../Components/motion/ScrollReveal";
import { FaEnvelope, FaPaperPlane, FaPhone } from "react-icons/fa";

/** Display-only placeholders (not real contact details). */
const CONTACT_DISPLAY = {
  email: "hegrag@chronicmagazine.studio",
  emailHref: "mailto:hello@chronicmagazine.studio",
  phone: "+1 (555) 284-0193",
  phoneHref: "tel:+15552840193",
  address: "Studio 7 · 442 Maple Row · Riverton, OR 97209",
};

const Contact = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);
    setSending(true);

    const formData = { firstName, lastName, email, message };

    try {
      const response = await api.post("/user/email", formData);
      if (response.status === 200) {
        setFeedback({ type: "success", text: "Thanks! Your message was sent successfully." });
        setFirstName("");
        setLastName("");
        setEmail("");
        setMessage("");
      } else {
        setFeedback({ type: "error", text: "Something went wrong. Please try again." });
      }
    } catch (error) {
      console.error("Error:", error);
      setFeedback({
        type: "error",
        text: "Could not send your message. Check your connection and try again.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero__bg" aria-hidden />
        <div className="container contact-hero__inner">
          <ScrollRevealWide>
            <p className="contact-hero__eyebrow">We&apos;d love to hear from you</p>
            <h1 className="contact-hero__title">Get in touch</h1>
            <p className="contact-hero__lead">
              Questions, ideas, or feedback—send a note and we&apos;ll get back when we can.
            </p>
          </ScrollRevealWide>
        </div>
      </section>

      <div className="container contact-layout">
        <ScrollRevealWide className="contact-visual">
          <div className="contact-visual__frame">
            <img
              src={samit}
              alt=""
              className="contact-visual__img"
            />
            <div className="contact-visual__overlay" aria-hidden />
          </div>
          <div className="contact-aside">
            <h2 className="contact-aside__title">Direct lines</h2>
            <ul className="contact-aside__list">
              <li>
                <FaEnvelope aria-hidden className="contact-aside__icon" />
                <a href={CONTACT_DISPLAY.emailHref}>{CONTACT_DISPLAY.email}</a>
              </li>
              <li>
                <FaPhone aria-hidden className="contact-aside__icon" />
                <a href={CONTACT_DISPLAY.phoneHref}>{CONTACT_DISPLAY.phone}</a>
              </li>
            </ul>
            <p className="contact-aside__note">{CONTACT_DISPLAY.address}</p>
          </div>
        </ScrollRevealWide>

        <ScrollReveal className="contact-form-wrap">
          <div className="contact-form-card">
            <h2 className="contact-form-card__title">Send a message</h2>
            <p className="contact-form-card__subtitle">
              All fields are required. We read every message.
            </p>

            {feedback && (
              <div
                className={`contact-feedback contact-feedback--${feedback.type}`}
                role="alert"
              >
                {feedback.text}
              </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <label htmlFor="first-name" className="contact-label">
                Name <span className="contact-required">*</span>
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
                Email <span className="contact-required">*</span>
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
                Message <span className="contact-required">*</span>
              </label>
              <textarea
                id="message"
                placeholder="Tell us what’s on your mind…"
                className="contact-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
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
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default Contact;

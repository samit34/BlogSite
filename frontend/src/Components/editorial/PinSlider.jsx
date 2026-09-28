import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { API_BASE_URL } from "../../api/client";
import { slidesFromPosts } from "./fallbacks";
import "./editorial.css";

gsap.registerPlugin(ScrollTrigger);

const PinSlider = ({ posts }) => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const slides = slidesFromPosts(posts, API_BASE_URL, 6);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return undefined;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const tween = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth + 48),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${Math.max(track.scrollWidth, window.innerWidth)}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      return () => tween.scrollTrigger?.kill();
    });

    return () => mm.revert();
  }, [slides.length]);

  return (
    <section className="sq-pin-slider" ref={sectionRef} aria-label="Pinned story gallery">
      <div className="sq-pin-slider__head">
        <p className="sq-kicker">Scroll to explore</p>
        <h2 className="sq-display">A gallery, pinned in place</h2>
      </div>
      <div className="sq-pin-slider__viewport">
        <div className="sq-pin-slider__track" ref={trackRef}>
          {slides.map((slide, index) => (
            <motion.article
              key={slide.id}
              className="sq-pin-card"
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              <Link to={slide.to} className="sq-pin-card__link">
                <div className="sq-pin-card__media">
                  <img src={slide.src} alt="" />
                </div>
                <div className="sq-pin-card__meta">
                  <span>
                    {String(index + 1).padStart(2, "0")} / {slide.cat}
                  </span>
                  <h3>{slide.title || "Open story"}</h3>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PinSlider;

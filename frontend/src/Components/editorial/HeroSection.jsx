import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import gsap from "gsap";
import "./editorial.css";

const HeroSection = () => {
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".sq-hero__media img", { scale: 1.16, duration: 2.2 }, 0)
        .from(".sq-hero__veil", { opacity: 0.2, duration: 1.4 }, 0)
        .from(".sq-hero__kicker", { y: 28, opacity: 0, duration: 0.7 }, 0.2)
        .from(
          ".sq-hero__line span",
          { yPercent: 110, duration: 1.05, stagger: 0.12 },
          0.28
        )
        .from(
          ".sq-hero__lede, .sq-hero__actions",
          { y: 32, opacity: 0, duration: 0.85, stagger: 0.08 },
          0.7
        );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="sq-hero" ref={root} aria-label="Magazine introduction">
      <div className="sq-hero__media" aria-hidden>
        <img src="/editorial/hero.jpg" alt="" />
        <div className="sq-hero__veil" />
      </div>
      <div className="sq-hero__copy">
        <p className="sq-hero__kicker">Independent magazine</p>
        <h1 className="sq-hero__title">
          <span className="sq-hero__line">
            <span>A blog that</span>
          </span>
          <span className="sq-hero__line">
            <span>stands out</span>
          </span>
        </h1>
        <p className="sq-hero__lede">
          Essays, photography, and long weekend reads—set in a calm, print-inspired
          layout. Built for readers who still like turning a page.
        </p>
        <div className="sq-hero__actions">
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
            <Link className="sq-btn sq-btn--solid" to="/layout/blog">
              Start reading
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
            <Link className="sq-btn sq-btn--ghost" to="/layout/about">
              Our story
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

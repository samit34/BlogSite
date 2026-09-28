import React from "react";
import "./About.css";
import "../../Components/editorial/editorial.css";
import { motion } from "motion/react";
import { FaPenFancy, FaCompass, FaUsers } from "react-icons/fa";

const About = () => {
  const features = [
    {
      icon: <FaPenFancy aria-hidden />,
      title: "Stories & columns",
      text: "Long reads, quick takes, and photo-led pieces—tagged so every issue of your feed feels intentional.",
    },
    {
      icon: <FaCompass aria-hidden />,
      title: "Wander the stacks",
      text: "From culture and design to travel notes—browse by mood, save what resonates, and circle back anytime.",
    },
    {
      icon: <FaUsers aria-hidden />,
      title: "Readers in mind",
      text: "Likes and wishlists keep your magazine rack personal. Quiet type keeps the focus on the words.",
    },
  ];

  return (
    <div className="about-page">
      <section className="sq-about-hero">
        <img src="/editorial/about-hero.jpg" alt="" />
        <div className="sq-about-hero__veil" aria-hidden />
        <div className="sq-about-hero__inner">
          <p className="sq-kicker" style={{ color: "rgba(250,247,240,0.75)" }}>
            The magazine
          </p>
          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            About this desk
          </motion.h1>
          <motion.p
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            An independent online magazine for curious readers—essay-length
            features, photography, and everything in between, served in a calm,
            print-inspired layout.
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
          <p className="sq-kicker">Editorial note</p>
          <h2>Less like a feed. More like a weekend magazine.</h2>
          <p>
            Samit started with a simple question: what if a blog felt like
            flipping through something you would leave on a coffee table? We mix
            essays, interviews, field notes, and illustrated stories—always with
            room for new voices and odd angles.
          </p>
          <p>
            Whether you are here for a slow Sunday or a five-minute coffee
            break, we hope you find something worth bookmarking.
          </p>
        </div>
      </section>

      <section className="sq-about-stats" aria-label="Magazine in numbers">
        {[
          ["12+", "issues in motion"],
          ["40+", "voices commissioned"],
          ["1", "desk, many rooms"],
          ["∞", "afternoons to read"],
        ].map(([n, l]) => (
          <div key={l}>
            <span>{n}</span>
            <p>{l}</p>
          </div>
        ))}
      </section>

      <section className="sq-about-features">
        {features.map((f, i) => (
          <motion.article
            key={f.title}
            className="sq-about-feature"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.55 }}
          >
            <div className="about-feature-card__icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </motion.article>
        ))}
      </section>

      <section className="sq-about-desk">
        <img src="/editorial/portrait.jpg" alt="" />
        <div className="sq-about-desk__copy">
          <p className="sq-kicker" style={{ color: "rgba(250,247,240,0.55)" }}>
            Editorial
          </p>
          <h2>The Samit desk</h2>
          <p>
            A rotating crew of editors, contributors, and guest writers keeps
            the shelves stocked—fiction sketches, city guides, opinion pieces,
            and the occasional rant we probably should have cut. Pull up a
            chair; the next story is almost ready.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;

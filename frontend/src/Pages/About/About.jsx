import React from "react";
import "./About.css";
import { ScrollReveal, ScrollRevealWide } from "../../Components/motion/ScrollReveal";
import { FaPenFancy, FaCompass, FaUsers, FaHeart } from "react-icons/fa";

const About = () => {
  const features = [
    {
      icon: <FaPenFancy aria-hidden />,
      title: "Stories & columns",
      text: "Long reads, quick takes, and photo-led pieces—tagged by category so every issue of your feed feels intentional.",
    },
    {
      icon: <FaCompass aria-hidden />,
      title: "Wander the stacks",
      text: "From culture and design to travel notes and weekend lists—browse by mood, save what resonates, and circle back anytime.",
    },
    {
      icon: <FaUsers aria-hidden />,
      title: "Readers in mind",
      text: "Likes and wishlists keep your magazine rack personal; quiet typography and layout keep the focus on the words.",
    },
  ];

  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero__bg" aria-hidden />
        <div className="container about-hero__inner">
          <ScrollRevealWide>
            <p className="about-hero__eyebrow">Magazine &amp; blogs</p>
            <h1 className="about-hero__title">About Chronic</h1>
            <p className="about-hero__lead">
              An independent online magazine for curious readers—essay-length features,
              bite-sized posts, and everything in between, served in a calm, print-inspired layout.
            </p>
          </ScrollRevealWide>
        </div>
      </section>

      <div className="container about-body">
        <ScrollReveal>
          <section className="about-section about-intro">
            <h2 className="about-section__title">Our editorial note</h2>
            <p className="about-intro__text">
              Chronic started as a small idea: what if a blog felt less like a feed and
              more like flipping through a weekend magazine? We mix essays, interviews,
              field notes, and illustrated stories—always with room for new voices and odd angles.
            </p>
            <p className="about-intro__text">
              Whether you are here for slow Sunday reads or five-minute coffee-break posts,
              we hope you find something worth bookmarking—and maybe something worth sharing
              at the dinner table.
            </p>
          </section>
        </ScrollReveal>

        <ScrollRevealWide>
          <section className="about-section">
            <h2 className="about-section__title">Inside the issue</h2>
            <div className="about-features">
              {features.map((f, i) => (
                <ScrollReveal key={f.title} className="about-feature-card" delay={i * 0.08}>
                  <div className="about-feature-card__icon">{f.icon}</div>
                  <h3 className="about-feature-card__title">{f.title}</h3>
                  <p className="about-feature-card__text">{f.text}</p>
                </ScrollReveal>
              ))}
            </div>
          </section>
        </ScrollRevealWide>

        {/* Optional stack section (no icon imports required if uncommented):
        <ScrollReveal>
          <section className="about-section about-stack">...</section>
        </ScrollReveal>
        */}

        <ScrollRevealWide>
          <section className="about-author">
            <div className="about-author__card">
              <div className="about-author__accent" aria-hidden />
              <div className="about-author__content">
                <p className="about-author__label">Editorial</p>
                <h2 className="about-author__name">The Chronic desk</h2>
                <p className="about-author__bio">
                  A rotating crew of editors, contributors, and guest writers keeps Chronic
                  stocked with fresh threads—fiction sketches, city guides, opinion pieces,
                  and the occasional rant we probably should have cut (but didn&apos;t).
                  Pull up a chair; the next story is almost ready.
                </p>
                <div className="about-author__heart">
                  <FaHeart aria-hidden /> <span>Made with care for readers &amp; writers</span>
                </div>
              </div>
            </div>
          </section>
        </ScrollRevealWide>

        <ScrollReveal>
          <section className="about-outro">
            <p>
              Thanks for reading Chronic. Wander the archive, stash pieces in your wishlist,
              and come back when you need a good story—there is always another page to turn.
            </p>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default About;

import { useLayoutEffect, useRef } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PIN_SCROLL_ITEMS } from "./fallbacks";
import "./editorial.css";

gsap.registerPlugin(ScrollTrigger);

const PinScrollList = () => {
  const sectionRef = useRef(null);
  const mediaRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const media = mediaRef.current;
    if (!section || !media) return undefined;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 992px)", () => {
      const frames = gsap.utils.toArray(".sq-pin-list__frame");
      const rows = gsap.utils.toArray(".sq-pin-list__row");
      gsap.set(frames, { autoAlpha: 0 });
      if (frames[0]) gsap.set(frames[0], { autoAlpha: 1 });

      const show = (index) => {
        frames.forEach((frame, i) => {
          gsap.to(frame, {
            autoAlpha: i === index ? 1 : 0,
            duration: 0.45,
            overwrite: "auto",
          });
        });
      };

      const triggers = rows.map((row, i) =>
        ScrollTrigger.create({
          trigger: row,
          start: "top 55%",
          end: "bottom 55%",
          onEnter: () => show(i),
          onEnterBack: () => show(i),
        })
      );

      const pin = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        pin: media,
        pinSpacing: false,
        anticipatePin: 1,
      });

      return () => {
        pin.kill();
        triggers.forEach((t) => t.kill());
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="sq-pin-list" ref={sectionRef} aria-label="How an issue is made">
      <div className="sq-pin-list__copycol">
        <div className="sq-pin-list__sticky">
          <p className="sq-kicker">How we build it</p>
          <h2 className="sq-display">Five steps, one issue</h2>
          <p className="sq-pin-list__lede">
            The same care that goes into a printed magazine—only the pages live here.
          </p>
        </div>
        <ol className="sq-pin-list__items">
          {PIN_SCROLL_ITEMS.map((item) => (
            <motion.li
              key={item.num}
              className="sq-pin-list__row"
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <span>{item.num}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </motion.li>
          ))}
        </ol>
      </div>
      <div className="sq-pin-list__media" ref={mediaRef}>
        {PIN_SCROLL_ITEMS.map((item) => (
          <div className="sq-pin-list__frame" key={item.num}>
            <img src={item.src} alt="" />
            <em>{item.num}</em>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PinScrollList;

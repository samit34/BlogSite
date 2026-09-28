import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { motion } from "motion/react";
import { API_BASE_URL } from "../../api/client";
import { slidesFromPosts } from "./fallbacks";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "./editorial.css";

const FeaturedSlider = ({ posts }) => {
  const slides = slidesFromPosts(posts, API_BASE_URL, 4);

  return (
    <section className="sq-featured" aria-label="Featured stories">
      <div className="sq-featured__intro">
        <p className="sq-kicker">Templates of a life</p>
        <h2 className="sq-display">Featured this issue</h2>
      </div>
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={slides.length > 1}
        autoplay={{ delay: 4200, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="sq-featured__swiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <Link to={slide.to} className="sq-featured__slide">
              <motion.img
                src={slide.src}
                alt=""
                initial={{ scale: 1.08 }}
                animate={{ scale: 1 }}
                transition={{ duration: 5.5, ease: "linear" }}
              />
              <div className="sq-featured__veil" />
              <div className="sq-featured__caption">
                <span>{slide.cat}</span>
                <h3>{slide.title || "Open story"}</h3>
                <em>View story</em>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default FeaturedSlider;

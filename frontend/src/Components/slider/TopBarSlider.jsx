import React from "react";
import "./slide.css";
import { Swiper, SwiperSlide } from "swiper/react";
import DOMPurify from "dompurify";

// Import Swiper styles

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { useBlog } from "../../Pages/Blogcontext";
import { Link } from "react-router-dom";

function TopBarSlider() {
  const { blog } = useBlog();
  const slides = Array.isArray(blog) ? blog.slice(0, 5) : [];

  if (slides.length === 0) {
    return null;
  }

  return (
    <>
      <div className="container p-0 ">
        <div className="home-slider-bar">
          <div className="slider-heading">
            <p>Latest headlines</p>
          </div>
          <Swiper
            slidesPerView={3} // Show all five slides at once
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            loop={slides.length > 2}
            navigation={false}
            modules={[Autoplay, Pagination, Navigation]}
            className="mySwiper"
          >
            {slides.map((b, index) => (
              <SwiperSlide key={b._id || index}>
                <Link
                  className="slider-link"
                  to={`/layout/specificblog/${b._id}`}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        (b.heading || "").slice(0, 36) + "…"
                      ),
                    }}
                  />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
}

export default TopBarSlider;

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

  // console.log("this is a blog" ,blog);

  return (
    <>
      <div className="container p-0 ">
        <div className="bg-red">
          <div className="slider-heading">
            {" "}
            <p>latest Blog</p>
          </div>
          <Swiper
            slidesPerView={3} // Show all five slides at once
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            loop={true}
            navigation={false}
            modules={[Autoplay, Pagination, Navigation]}
            className="mySwiper"
          >
            {blog.slice(0, 5).map((b, index) => (
              <SwiperSlide key={index}>
                <Link
                  className="slider-link"
                  to={`/layout/specificblog/${b._id}`}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        b.heading.slice(0, 30) + "..."
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

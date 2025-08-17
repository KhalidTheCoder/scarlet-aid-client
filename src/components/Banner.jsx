import React from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import img1 from "../assets/woman.jpg";
import img2 from "../assets/ob.jpg";
import { useNavigate } from "react-router";

const Banner = () => {
  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500,
    pauseOnHover: true,
    fade: true,
    arrows: false,
    cssEase: "ease-in-out",
  };

  const slides = [
    {
      img: img1,
      title: "Donate Blood, Save Lives",
      desc: "Become a part of something meaningful. Donate blood or connect with a nearby donor. Every drop makes a difference.",
      primary: "Join as a Donor",
      primaryLink: "/registration",
      secondary: "Search Donors",
      secondaryLink: "/searchDonor",
    },
    {
      img: img2,
      title: "Your Health, Our Mission",
      desc: "Connecting communities with lifesaving donations and medical support across the nation.",
      primary: "Get Started",
      primaryLink: "/registration",
      secondary: "Find Donors",
      secondaryLink: "/searchDonor",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto my-14">
      <div className="overflow-hidden rounded-3xl">
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <div key={index} className="relative">
              <img
                src={slide.img}
                alt={`Slide ${index + 1}`}
                className="w-full h-[550px] object-cover rounded-3xl"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent rounded-3xl flex items-center">
                <motion.div
                  initial={{ opacity: 0, x: -80 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="px-6 md:px-16 space-y-6 max-w-2xl"
                >
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-wide text-white drop-shadow-2xl">
                    {slide.title.split(",")[0]},
                    <span className="text-[#e13d00]">
                      {" "}
                      {slide.title.split(",")[1]}
                    </span>
                  </h1>

                  <p className="text-white/90 text-base sm:text-lg md:text-xl font-medium leading-relaxed drop-shadow-md">
                    {slide.desc}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => navigate(slide.primaryLink)}
                      className="px-7 py-3 bg-[#BC430D] hover:bg-[#e13d00] text-white text-lg rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    >
                      {slide.primary}
                    </button>
                    <button
                      onClick={() => navigate(slide.secondaryLink)}
                      className="px-7 py-3 bg-white/90 text-[#BC430D] border-2 border-[#BC430D] hover:bg-[#BC430D] hover:text-white text-lg rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    >
                      {slide.secondary}
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Banner;

import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const sponsors = [
  { name: "Red Crescent", logo: "https://i.ibb.co.com/W4bD97ts/image.png" },
  { name: "BRAC", logo: "https://i.ibb.co.com/QF0Pf2Pf/brac-logo-350x350.png" },
  { name: "Health Care", logo: "https://i.ibb.co.com/Q076s8S/healthcare-hospital-logo.png" },
  { name: "WHO", logo: "https://i.ibb.co.com/0jBfB965/who-logo.png" },
  { name: "Save the Children", logo: "https://i.ibb.co.com/4gghsmBr/Logo-Savethe-Children.png" },
  { name: "UNICEF", logo: "https://i.ibb.co.com/tTShvrf8/imes.png" },
];

const Sponsors = () => {
  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2500,
    speed: 1000,
    arrows: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Section Title */}
        <h2
          data-aos="fade-down"
          className="text-4xl md:text-5xl font-extrabold text-center text-[#BC430D] mb-4"
        >
          Our Trusted Partners
        </h2>
        <p
          data-aos="fade-up"
          className="text-center text-gray-600 text-base sm:text-lg max-w-2xl mx-auto mb-16 font-medium"
        >
          ScarletAid proudly collaborates with globally recognized organizations
          and healthcare institutions to create greater impact and save lives.
        </p>

        {/* Sponsors Carousel */}
        <Slider {...settings}>
          {sponsors.map((s, i) => (
            <div key={i} className="px-4">
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:scale-105 flex items-center justify-center my-6 py-6 px-4">
                <img
                  src={s.logo}
                  alt={s.name}
                  className="h-16 object-contain transition duration-500"
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Sponsors;

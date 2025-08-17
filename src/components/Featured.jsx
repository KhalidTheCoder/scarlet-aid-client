import React from "react";
import { FaUserCheck, FaSearchLocation, FaHandsHelping, FaHeartbeat } from "react-icons/fa";

const features = [
  {
    title: "Verified Donors",
    description:
      "Every donor is thoroughly vetted to ensure safe, responsible, and authentic blood donations across the platform.",
    icon: <FaUserCheck className="text-[#D43F00] text-4xl" />,
  },
  {
    title: "Smart Donor Finder",
    description:
      "Quickly locate nearby blood donors using advanced search filters and real-time availability tracking.",
    icon: <FaSearchLocation className="text-[#D43F00] text-4xl" />,
  },
  {
    title: "Urgent Response System",
    description:
      "Submit emergency requests and receive priority alerts when compatible donors are available within your area.",
    icon: <FaHeartbeat className="text-[#D43F00] text-4xl" />,
  },
  {
    title: "Trusted Community",
    description:
      "Join a growing network of compassionate individuals united by a shared mission to save lives through donation.",
    icon: <FaHandsHelping className="text-[#D43F00] text-4xl" />,
  },
];

const Featured = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-20">
      <h2
        data-aos="fade-down"
        data-aos-duration="800"
        className="text-4xl md:text-5xl text-center font-extrabold text-[#BC430D] mb-3"
      >
        Why Choose Our Platform?
      </h2>

      <p
        data-aos="fade-up"
        data-aos-duration="800"
        data-aos-delay="200"
        className="text-center text-gray-600 text-base sm:text-lg max-w-2xl mx-auto mb-16 font-medium"
      >
        We’re more than just a donation platform! We’re a secure, community-driven system built for urgency, reliability, and trust.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, idx) => (
          <div
            key={idx}
            data-aos="zoom-in"
            data-aos-delay={`${idx * 150}`}
            data-aos-duration="800"
            className="bg-gradient-to-br from-[#FDD0C7] via-[#FEE5DA] to-[#FDD0C7] p-6 rounded-2xl shadow-lg text-center transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
          >
            <div className="flex justify-center mb-4">{feature.icon}</div>
            <h3 className="text-lg font-semibold text-[#D43F00] mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-600 font-medium">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Featured;

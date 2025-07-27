import React from "react";
import { motion } from "framer-motion";
import { FaUserCheck, FaSearchLocation, FaHandsHelping, FaHeartbeat } from "react-icons/fa";

const features = [
  {
    title: "Verified Donors",
    description: "Every donor is thoroughly vetted to ensure safe, responsible, and authentic blood donations across the platform.",
    icon: <FaUserCheck className="text-[#D43F00] text-4xl" />,
  },
  {
    title: "Smart Donor Finder",
    description: "Quickly locate nearby blood donors using advanced search filters and real-time availability tracking.",
    icon: <FaSearchLocation className="text-[#D43F00] text-4xl" />,
  },
  {
    title: "Urgent Response System",
    description: "Submit emergency requests and receive priority alerts when compatible donors are available within your area.",
    icon: <FaHeartbeat className="text-[#D43F00] text-4xl" />,
  },
  {
    title: "Trusted Community",
    description: "Join a growing network of compassionate individuals united by a shared mission to save lives through donation.",
    icon: <FaHandsHelping className="text-[#D43F00] text-4xl" />,
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Featured = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-20">
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-center text-[#D43F00] mb-4"
      >
        Why Choose Our Platform?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center text-gray-600 text-base sm:text-lg max-w-2xl mx-auto mb-16 font-medium"
      >
        We’re more than just a donation platform! we’re a secure, community-driven system built for urgency, reliability, and trust.
      </motion.p>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            className="bg-gradient-to-br from-[#FDD0C7] via-[#FEE5DA] to-[#FDD0C7] p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition duration-300"
          >
            <div className="flex justify-center mb-4">{feature.icon}</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-600 font-medium">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Featured;

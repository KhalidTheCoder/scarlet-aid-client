import React from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import img1 from "../assets/woman.jpg";
import img2 from "../assets/360.jpg";
import img3 from "../assets/medict.jpg";

const Banner = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-[#FFF7F1] via-[#FFEBD2] to-[#FFD4B2] rounded-3xl shadow-xl max-w-7xl mx-auto my-14 overflow-hidden">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-12 lg:px-20 py-20 gap-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex-1 space-y-6 text-center md:text-left"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#D43F00] leading-tight">
            Donate Blood, Save Lives
          </h1>
          <p className="text-gray-600 text-base font-medium sm:text-lg max-w-xl md:max-w-md mx-auto md:mx-0">
            Become a part of something meaningful. Donate blood or connect with
            a nearby donor. Every drop makes a difference.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button
              onClick={() => navigate("/registration")}
              className="px-6 py-3 bg-[#D43F00] hover:bg-[#A53000] text-white rounded-xl font-semibold shadow-md hover:shadow-xl transition duration-300"
            >
              Join as a Donor
            </button>
            <button
              onClick={() => navigate("/searchDonor")}
              className="px-6 py-3 bg-white text-[#D43F00] border-2 border-[#D43F00] hover:bg-[#D43F00] hover:text-white rounded-xl font-semibold shadow-md hover:shadow-xl transition duration-300"
            >
              Search Donors
            </button>
          </div>
        </motion.div>

        <motion.div
          className="flex-1 relative flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0 h-auto md:h-[340px] lg:h-[380px]"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.img
            src={img1}
            alt="Main Blood Donation"
            className="w-40 sm:w-48 md:w-60 h-40 sm:h-48 md:h-60 object-cover rounded-2xl shadow-2xl border-[6px] border-white z-20 md:static"
            animate={{ y: [0, -10, 0], rotate: [0, 1.5, -1.5, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          />

          <motion.img
            src={img3}
            alt="Secondary Donation 1"
            className="w-36 sm:w-40 md:w-48 h-36 sm:h-40 md:h-48 object-cover rounded-2xl shadow-xl border-[5px] border-white opacity-80 z-10 
              md:absolute md:top-4 md:left-0"
            animate={{ y: [0, 12, 0], rotate: [0, -2, 1, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          />

          <motion.img
            src={img2}
            alt="Secondary Donation 2"
            className="w-36 sm:w-40 md:w-48 h-36 sm:h-40 md:h-48 object-cover rounded-2xl shadow-xl border-[5px] border-white opacity-80 z-10 
              md:absolute md:bottom-4 md:right-0"
            animate={{ y: [0, 16, 0], rotate: [0, 2, -1, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Banner;

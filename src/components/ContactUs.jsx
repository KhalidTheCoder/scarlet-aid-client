import React from "react";
import { motion } from "framer-motion";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import Swal from "sweetalert2";

const ContactUs = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-20" id="contact">
     
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-extrabold text-center text-[#D43F00] mb-4"
      >
        Get in Touch
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-center text-gray-600 text-base sm:text-lg max-w-2xl mx-auto mb-16 font-medium"
      >
        We'd love to hear from you. Whether you have a question about features,
        donations, or anything else our team is ready to answer.
      </motion.p>

      
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">
       
        <motion.form
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onSubmit={(e) => {
            e.preventDefault();
            Swal.fire({
              title: "Message Sent!",
              text: "Thank you for reaching out. We will get back to you soon.",
              icon: "success",
              confirmButtonColor: "#D43F00",
              confirmButtonText: "Okay",
            });
            e.target.reset();
          }}
          className="bg-[#FDD0C7] p-10 rounded-2xl shadow-xl space-y-6"
        >
          <div>
            <label className="block text-sm font-semibold text-[#241705] mb-2">
              Full Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-[#241705] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D43F00] bg-white"
              placeholder="Your Name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#241705] mb-2">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-[#241705] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D43F00] bg-white"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#241705] mb-2">
              Message
            </label>
            <textarea
              rows="5"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-[#241705] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D43F00] bg-white resize-none"
              placeholder="Type your message here..."
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-[#F09410] hover:bg-[#BC430D] text-white font-semibold py-3 rounded-xl transition duration-300 shadow-md hover:shadow-xl"
          >
            Send Message
          </button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#FFF7F1] p-10 rounded-2xl shadow-xl space-y-8"
        >
          <div>
            <h3 className="text-2xl font-bold text-[#D43F00] mb-2">
              We're Here to Help
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Our team is always ready to assist you. Whether it's a question
              about donation, volunteering, or events. feel free to reach out!
            </p>
          </div>

          <div className="flex items-start gap-5">
            <FaPhoneAlt className="text-[#D43F00] text-xl mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="font-semibold text-gray-800 text-base">
                +880 1234-567890
              </p>
            </div>
          </div>

          <div className="flex items-start gap-5">
            <FaEnvelope className="text-[#D43F00] text-xl mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="font-semibold text-gray-800 text-base">
                support@scarletaid.org
              </p>
            </div>
          </div>

          <div className="flex items-start gap-5">
            <FaMapMarkerAlt className="text-[#D43F00] text-xl mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-500">Location</p>
              <p className="font-semibold text-gray-800 text-base">
                Dhaka, Bangladesh
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Working Hours</p>
            <p className="font-semibold text-gray-800 text-base">
              Sunday - Thursday: 9:00 AM – 6:00 PM
            </p>
            <p className="text-gray-600 font-medium text-sm">Friday & Saturday: Closed</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Follow Us</p>
            <div className="flex gap-4 text-[#D43F00] text-xl">
              <a
                href="#"
                aria-label="Facebook"
                className="hover:text-[#A53000] transition"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="hover:text-[#A53000] transition"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="hover:text-[#A53000] transition"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="hover:text-[#A53000] transition"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactUs;

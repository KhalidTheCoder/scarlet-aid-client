import React from "react";
import {
  FaSearch,
  FaClipboardList,
  FaShieldAlt,
  FaUsers,
} from "react-icons/fa";

const ScarletAidMission = () => {
  return (
    <section
      id="mission"
      className="max-w-7xl mx-auto px-6 md:px-10 py-20 relative"
    >
      {/* Heading */}
      <div className="text-center mb-16">
        <h2
          data-aos="fade-down"
          data-aos-duration="800"
          className="text-4xl md:text-5xl font-extrabold text-[#BC430D]"
        >
          How ScarletAid Helps
        </h2>
        <p
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="150"
          className="mt-4 text-gray-600 text-base sm:text-lg max-w-2xl mx-auto font-medium"
        >
          ScarletAid is built to connect donors and patients faster, safer, and
          smarter. Every drop counts! here’s how we make an impact.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div
          data-aos="fade-right"
          data-aos-duration="800"
          className="rounded-2xl overflow-hidden shadow-2xl"
        >
          <img
            src="https://i.ibb.co.com/nK6QPPn/woman.jpg"
            alt="Blood Donation"
            className="w-full h-full object-cover"
          />
        </div>

        <div data-aos="fade-left" data-aos-duration="800" className="space-y-8">
          <div className="flex items-start gap-5 bg-[#FDD0C7] p-6 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
            <FaSearch className="text-[#D43F00] text-3xl mt-1" />
            <div>
              <h3 className="text-xl font-bold text-[#241705]">
                Find a Donor Quickly
              </h3>
              <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                Easily search and connect with nearby donors. Our smart matching
                system ensures patients get the right donor at the right time.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-5 bg-[#FFF7F1] p-6 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
            <FaClipboardList className="text-[#D43F00] text-3xl mt-1" />
            <div>
              <h3 className="text-xl font-bold text-[#241705]">
                Track Donation Requests
              </h3>
              <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                Manage, update, and monitor your donation requests from one
                place. Transparency and clarity for both donors and patients.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-5 bg-[#FDD0C7] p-6 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
            <FaShieldAlt className="text-[#D43F00] text-3xl mt-1" />
            <div>
              <h3 className="text-xl font-bold text-[#241705]">
                Safe & Verified Donors
              </h3>
              <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                Every donor profile is verified to build trust and safety in the
                community. Donors you can count on when it matters most.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-5 bg-[#FFF7F1] p-6 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
            <FaUsers className="text-[#D43F00] text-3xl mt-1" />
            <div>
              <h3 className="text-xl font-bold text-[#241705]">
                Join Community Events
              </h3>
              <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                Participate in campaigns and awareness programs that inspire and
                encourage more people to donate blood and save lives.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScarletAidMission;

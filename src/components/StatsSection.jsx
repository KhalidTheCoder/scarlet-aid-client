import React from "react";
import CountUp from "react-countup";
import {
  FaExclamationCircle,
  FaCity,
  FaHeartbeat,
  FaCalendarAlt,
} from "react-icons/fa";

const stats = [
  {
    icon: <FaExclamationCircle />,
    count: 124,
    label: "Urgent Requests Fulfilled",
    description: "Quickly responding to critical blood donation needs.",
  },
  {
    icon: <FaCity />,
    count: 64,
    label: "Cities Covered",
    description: "Our services reach multiple cities across the country.",
  },
  {
    icon: <FaHeartbeat />,
    count: 1020,
    label: "Lives Impacted",
    description: "Through donors' contributions, lives are saved every day.",
  },
  {
    icon: <FaCalendarAlt />,
    count: 18,
    label: "Blood Drives Organized",
    description: "Regular events to encourage community blood donations.",
  },
];

const StatsSection = () => {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10 text-center">
        <h2
          data-aos="fade-down"
          data-aos-duration="800"
          className="text-4xl md:text-5xl font-extrabold text-[#BC430D] mb-3"
        >
          Our Impact in Numbers
        </h2>
        <p
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="200"
          className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto mb-12 font-medium"
        >
          See how our community and donors are making a difference every day.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              data-aos="zoom-in"
              data-aos-delay={`${idx * 150}`}
              data-aos-duration="800"
              className="relative bg-gradient-to-br from-[#FDD0C7] via-[#FEE5DA] to-[#FDD0C7] p-8 rounded-3xl shadow-xl text-center font-medium flex flex-col items-center transition-all duration-300 hover:shadow-2xl hover:scale-[1.03]"
            >
              <div className="text-[#D43F00] text-5xl mb-4">{stat.icon}</div>

              <h3 className="text-4xl font-bold text-[#241705]">
                <CountUp end={stat.count} duration={2} />
              </h3>

              <p className="text-lg font-semibold text-[#D43F00] mt-2">
                {stat.label}
              </p>

              <p className="text-sm text-gray-700 mt-1">{stat.description}</p>

              <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-[#D43F00]/10 blur-2xl pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

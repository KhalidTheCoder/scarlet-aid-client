import React from "react";
import CountUp from "react-countup";
import { FaExclamationCircle, FaCity, FaHeartbeat, FaCalendarAlt } from "react-icons/fa";

const StatsSection = () => {
  const stats = [
    {
      icon: <FaExclamationCircle className="text-[#D43F00] text-4xl" />,
      count: 124,
      label: "Urgent Requests Fulfilled",
      description: "Quickly responding to critical blood donation needs.",
    },
    {
      icon: <FaCity className="text-[#F09410] text-4xl" />,
      count: 64,
      label: "Cities Covered",
      description: "Our services reach multiple cities across the country.",
    },
    {
      icon: <FaHeartbeat className="text-[#D43F00] text-4xl" />,
      count: 1020,
      label: "Lives Impacted",
      description: "Through donors' contributions, lives are saved every day.",
    },
    {
      icon: <FaCalendarAlt className="text-[#F09410] text-4xl" />,
      count: 18,
      label: "Blood Drives Organized",
      description: "Regular events to encourage community blood donations.",
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#D43F00] mb-3">
          Our Impact in Numbers
        </h2>
        <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto mb-12 font-medium">
          See how our community and donors are making a difference every day.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white shadow-xl rounded-3xl p-8 flex flex-col items-center text-center transition-transform transform hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="mb-4">{stat.icon}</div>
              <h3 className="text-4xl font-bold text-[#241705]">
                <CountUp end={stat.count} duration={2} />
              </h3>
              <p className="text-lg font-semibold text-[#D43F00] mt-2">{stat.label}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

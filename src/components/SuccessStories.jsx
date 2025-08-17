import React from "react";
import { FaQuoteLeft } from "react-icons/fa";

const SuccessStories = () => {
  const stories = [
    {
      id: 1,
      name: "Rahim Uddin",
      role: "Blood Donor",
      location: "Dhaka, Bangladesh",
      img: "https://i.ibb.co.com/Kxwy1NBV/32.jpg",
      story:
        "ScarletAid helped me save a stranger’s life. The process was smooth, safe, and deeply rewarding.",
    },
    {
      id: 2,
      name: "Ayesha Khan",
      role: "Recipient",
      location: "Chittagong, Bangladesh",
      img: "https://i.ibb.co.com/BH57kVT5/44.jpg",
      story:
        "Finding a donor through ScarletAid was quick and stress-free. It gave me hope during my hardest time.",
    },
    {
      id: 3,
      name: "Samiul Hasan",
      role: "Volunteer",
      location: "Sylhet, Bangladesh",
      img: "https://i.ibb.co.com/zWQCsCQG/41.jpg",
      story:
        "Volunteering with ScarletAid made me realize how small acts of kindness can save entire families.",
    },
  ];

  return (
    <section
      id="stories"
      className="max-w-7xl font-medium mx-auto px-6 md:px-10 py-20"
    >
      <div className="text-center mb-16">
        <h2
          data-aos="fade-down"
          data-aos-duration="800"
          className="text-4xl md:text-5xl font-extrabold text-[#BC430D]"
        >
          Lives Touched
        </h2>
        <p
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="150"
          className="mt-4 text-gray-600 text-base sm:text-lg max-w-2xl mx-auto font-medium"
        >
          Every donation creates a story of hope and survival. Here are some
          inspiring journeys shared by our community.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        {stories.map((story, index) => (
          <div
            key={story.id}
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-delay={index * 200}
            className="bg-white relative rounded-2xl shadow-lg p-8 hover:shadow-2xl transition transform hover:-translate-y-2"
          >
            <FaQuoteLeft className="absolute top-6 left-6 text-[#D43F00] text-4xl opacity-60" />

            <div className="flex justify-center -mt-2 mb-6">
              <img
                src={story.img}
                alt={story.name}
                className="w-20 h-20 object-cover rounded-full border-4 border-[#D43F00] shadow-md"
              />
            </div>

            <p className="text-gray-700 text-sm leading-relaxed mb-6 italic relative z-10">
              {story.story}
            </p>

            <div className="text-center">
              <h3 className="text-lg font-bold text-[#241705]">{story.name}</h3>
              <span className="inline-block text-xs font-semibold text-white bg-[#D43F00] px-3 py-1 rounded-full mt-2">
                {story.role}
              </span>
              <p className="text-gray-500 text-sm mt-2">{story.location}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SuccessStories;

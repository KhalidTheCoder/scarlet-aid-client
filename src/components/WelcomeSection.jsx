import React, { useContext } from "react";
import { AuthContext } from "../providers/AuthContext";
import Lottie from "lottie-react";
import bloodDonationAnimation from "../assets/blood.json";

const WelcomeSection = () => {
  const { user } = useContext(AuthContext);

  return (
    <section className="bg-gradient-to-br from-[#FDD0C7] via-[#FEE5DA] to-[#FDD0C7] rounded-3xl shadow-2xl p-10 mb-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="w-64 md:w-72 flex-shrink-0">
          <Lottie animationData={bloodDonationAnimation} loop={true} />
        </div>

        <div className="text-center md:text-left max-w-xl">
          <h1 className="text-4xl font-extrabold text-[#BC430D] mb-4">
            Hello, <span className="text-[#F09410]">{user?.displayName}</span>!
          </h1>
          <p className="text-[#241705] font-medium text-lg leading-relaxed">
            Thank you for being a part of our life-saving mission. Every drop
            you give brings hope and creates a brighter tomorrow.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;

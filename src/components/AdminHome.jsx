import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../providers/AuthContext";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { Users, Droplet, HandCoins, ArrowRight } from "lucide-react";
import Loading from "../pages/Loading";
import { Link } from "react-router";
import Title from "./Title";
import WelcomeSection from "./WelcomeSection";

const AdminHome = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/stats");
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  const cardBaseStyle =
    "bg-white rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:bg-[#FFF1E6]";

  const iconBoxStyle = "p-3 w-fit rounded-xl mb-4";

  const linkStyle =
    "mt-4 text-sm text-[#D97706] font-medium flex items-center hover:underline";

  return (
    <div className="p-6 bg-[#FFF4E6] rounded-xl">
      <div className="mt-5 mb-15 flex justify-center">
        <Title>Stay Connected, Stay Inspired</Title>
      </div>

      <WelcomeSection></WelcomeSection>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        <div className={cardBaseStyle}>
          <div>
            <div className={`${iconBoxStyle} bg-[#FEEAD5]`}>
              <Users className="w-8 h-8 text-[#F09410]" />
            </div>
            <p className="text-2xl font-semibold text-[#241705]">
              {stats.totalDonors || 0}
            </p>
            <p className="text-sm font-medium text-[#6B4C2C]">
              Total Donors Registered
            </p>
            <p className="text-xs font-medium text-gray-500 mt-1">
              Active members who have signed up to donate blood.
            </p>
          </div>
          <div>
            <Link to="/dashboard/all-users" className={linkStyle}>
              View Donors <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>

        <div className={cardBaseStyle}>
          <div>
            <div className={`${iconBoxStyle} bg-[#DCFCE7]`}>
              <HandCoins className="w-8 h-8 text-[#15803D]" />
            </div>
            <p className="text-2xl font-semibold text-[#241705]">
              ${parseFloat(stats.totalFunds || 0).toFixed(2)}
            </p>
            <p className="text-sm font-medium text-[#6B4C2C]">
              Total Funds Raised
            </p>
            <p className="text-xs font-medium text-gray-500 mt-1">
              Donations collected to support blood donation campaigns.
            </p>
          </div>
          <div>
            <Link to="/fund" className={linkStyle}>
              View Funds <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>

        <div className={cardBaseStyle}>
          <div>
            <div className={`${iconBoxStyle} bg-[#DBEAFE]`}>
              <Droplet className="w-8 h-8 text-[#2563EB]" />
            </div>
            <p className="text-2xl font-semibold text-[#241705]">
              {stats.totalRequests || 0}
            </p>
            <p className="text-sm font-medium text-[#6B4C2C]">
              Blood Requests Made
            </p>
            <p className="text-xs font-medium text-gray-500 mt-1">
              Number of total donation requests submitted in the platform.
            </p>
          </div>
          <div>
            <Link to="/dashboard/all-blood-donation-request" className={linkStyle}>
              View Requests <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;

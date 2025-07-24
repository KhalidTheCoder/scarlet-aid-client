import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../providers/AuthContext";
import useAxiosSecure from "../hooks/useAxiosSecure";
import {
  Users,
  Droplet,
  HandCoins,
} from "lucide-react";
import Loading from "../pages/Loading";

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

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <div className="p-6">
      
      <h1 className="text-2xl font-bold mb-6">
        Welcome, {user?.displayName || "Admin"}!
      </h1>

      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white border rounded-xl shadow-sm p-6 flex items-center gap-4">
          <Users className="w-12 h-12 text-red-500" />
          <div>
            <p className="text-xl font-bold">{stats.totalDonors || 0}</p>
            <p className="text-sm text-gray-600">Total Donors</p>
          </div>
        </div>

        <div className="bg-white border rounded-xl shadow-sm p-6 flex items-center gap-4">
          <HandCoins className="w-12 h-12 text-green-500" />
          <div>
            <p className="text-xl font-bold">
              ${parseFloat(stats.totalFunds || 0).toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">Total Funds</p>
          </div>
        </div>

        <div className="bg-white border rounded-xl shadow-sm p-6 flex items-center gap-4">
          <Droplet className="w-12 h-12 text-blue-500" />
          <div>
            <p className="text-xl font-bold">{stats.totalRequests || 0}</p>
            <p className="text-sm text-gray-600">Blood Requests</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;

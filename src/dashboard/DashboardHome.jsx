import React from "react";
import useUserRole from "../hooks/useUserRole";
import DonorHome from "../components/DonorHome";
import AdminHome from "../components/AdminHome";
import VolunteerHome from "../components/Volunteerhome";

const DashboardHome = () => {
  const { role, roleLoading } = useUserRole();

  if (roleLoading) {
    return <div className="text-center py-10">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 bg-white shadow rounded-md">
      {role === "admin" && <AdminHome />}
      {role === "volunteer" && <VolunteerHome />}
      {role === "donor" && <DonorHome />}
    </div>
  );
};

export default DashboardHome;
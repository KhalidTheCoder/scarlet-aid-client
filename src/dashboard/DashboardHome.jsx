import React from "react";
import useUserRole from "../hooks/useUserRole";
import DonorHome from "../components/DonorHome";
import AdminHome from "../components/AdminHome";
import VolunteerHome from "../components/Volunteerhome";
import Loading from "../pages/Loading";

const DashboardHome = () => {
  const { role, roleLoading } = useUserRole();

  if (roleLoading) {
    return <Loading></Loading>;
  }

  return (
    <div>
      {role === "admin" && <AdminHome />}
      {role === "volunteer" && <VolunteerHome />}
      {role === "donor" && <DonorHome />}
    </div>
  );
};

export default DashboardHome;
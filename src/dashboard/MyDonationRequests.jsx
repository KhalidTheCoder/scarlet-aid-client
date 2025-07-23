import React from "react";
import useUserRole from "../hooks/useUserRole";

const MyDonationRequests = () => {
  const { role, roleLoading } = useUserRole();
  if (roleLoading) return <div>Loading role...</div>;

  return (
    <div>
      <h1>User Role: {role}</h1>
    </div>
  );
};

export default MyDonationRequests;

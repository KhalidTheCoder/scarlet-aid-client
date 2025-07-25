import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { AuthContext } from "../providers/AuthContext";
import useAxios from "../hooks/useAxios";
import Loading from "../pages/Loading";
import Table from "../components/Table";
import { Eye } from "lucide-react";

const fetchPendingRequests = async ({ queryKey }) => {
  const [, { page, limit }, axios] = queryKey;
  const res = await axios.get("/donation-requests/public", {
    params: {
      status: "pending",
      page,
      limit,
    },
  });
  return res.data;
};

const DonationRequests = () => {
  const axios = useAxios();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["pendingDonationRequests", { page, limit }, axios],
    queryFn: fetchPendingRequests,
    keepPreviousData: true,
  });

  const handleView = (id) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/dashboard/donation-requests/${id}`);
    }
  };

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <p className="text-center text-red-500">
        Failed to load donation requests.
      </p>
    );

  const requests = data?.requests || [];
  const totalPages = data?.totalPages || 1;

  const columns = [
    { header: "Recipient", accessor: "recipientName" },
    {
      header: "Location",
      accessor: "recipientDistrict",
      cell: (_, row) => `${row.recipientDistrict}, ${row.recipientUpazila}`,
    },
    { header: "Blood Group", accessor: "bloodGroup" },
    {
      header: "Date",
      accessor: "donationDate",
      cell: (val) => new Date(val).toLocaleDateString(),
    },
    { header: "Time", accessor: "donationTime" },
    {
      header: "View",
      accessor: "view",
      cell: (_, row) => (
        <button
          className="btn btn-sm btn-neutral"
          onClick={() => handleView(row._id)}
        >
          <Eye className="w-4 h-4"></Eye>
        </button>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Pending Donation Requests
      </h1>
      <Table
        columns={columns}
        data={requests}
        currentPage={page}
        limit={limit}
        emptyMessage="No pending donation requests."
      />

      {totalPages > 1 && (
        <div className="join mt-6 flex justify-center">
          <button
            className="join-item btn"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            «
          </button>
          <button className="join-item btn">
            Page {page} of {totalPages}
          </button>
          <button
            className="join-item btn"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            »
          </button>
        </div>
      )}
    </div>
  );
};

export default DonationRequests;

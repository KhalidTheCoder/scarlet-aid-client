import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../providers/AuthContext";
import Loading from "../pages/Loading";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Title from "../components/Title";

const fetchDonationRequests = async ({ queryKey }) => {
  const [, { email, status, page, limit }, axiosSecure] = queryKey;
  const res = await axiosSecure.get("/donation-requests/my-requests", {
    params: {
      email,
      status: status !== "all" ? status : undefined,
      page,
      limit,
    },
  });
  return res.data;
};

const MyDonationRequests = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "myDonationRequests",
      { email: user?.email, status: statusFilter, page, limit },
      axiosSecure,
    ],
    queryFn: fetchDonationRequests,
    enabled: !!user?.email,
    keepPreviousData: true,
  });

  if (isLoading) return <Loading />;
  if (isError)
    return <p className="text-red-500 text-center">Failed to load requests.</p>;

  const { requests = [], totalPages = 1 } = data || {};

  return (
    <div className="min-h-screen p-4 overflow-x-hidden">
      <div className="mb-5">
        <Title>My Donation Requests</Title>
      </div>

      <div className="my-5">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="select select-bordered font-medium w-full max-w-xs"
        >
          <option className="font-medium" value="all">
            All
          </option>
          <option className="font-medium" value="pending">
            Pending
          </option>
          <option className="font-medium" value="inprogress">
            In Progress
          </option>
          <option className="font-medium" value="done">
            Done
          </option>
          <option className="font-medium" value="canceled">
            Canceled
          </option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 hidden md:block">
        <table className="table table-zebra text-sm min-w-full">
          <thead className="text-lg">
            <tr>
              <th>#</th>
              <th>Recipient</th>
              <th>Blood Group</th>
              <th>Hospital</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody className="font-medium">
            {requests.length > 0 ? (
              requests.map((req, index) => (
                <tr key={req._id}>
                  <th>{(page - 1) * limit + index + 1}</th>
                  <td>{req.recipientName}</td>
                  <td>{req.bloodGroup}</td>
                  <td>{req.hospitalName}</td>
                  <td>{new Date(req.donationDate).toLocaleDateString()}</td>
                  <td className="capitalize">{req.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center font-bold text-lg text-gray-500"
                >
                  No requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 md:hidden">
        {requests.length > 0 ? (
          requests.map((req) => (
            <div
              key={req._id}
              className="p-4 rounded-lg font-medium bg-base-100 shadow"
            >
              <p className="font-semibold">{req.recipientName}</p>
              <p className="text-sm text-gray-500">{req.hospitalName}</p>
              <div className="flex justify-between text-sm mt-2">
                <span>{req.bloodGroup}</span>
                <span>{new Date(req.donationDate).toLocaleDateString()}</span>
              </div>
              <span className="mt-2 inline-block text-xs px-2 py-1 rounded bg-gray-200 capitalize">
                {req.status}
              </span>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No donation requests found.
          </p>
        )}
      </div>

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
    </div>
  );
};

export default MyDonationRequests;

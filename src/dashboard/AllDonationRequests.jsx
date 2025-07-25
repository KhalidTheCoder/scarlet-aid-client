import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { Check, Eye, Pencil, Trash2, XCircle } from "lucide-react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useUserRole from "../hooks/useUserRole";
import Table from "../components/Table";
import Loading from "../pages/Loading";

const AllDonationRequests = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { role, isLoading: roleLoading } = useUserRole();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["allDonationRequests", currentPage, statusFilter],
    queryFn: async () => {
      const res = await axiosSecure.get("/donation-requests", {
        params: {
          page: currentPage,
          limit,
          status: statusFilter || undefined,
        },
      });
      return res.data;
    },
    keepPreviousData: true,
    enabled: !roleLoading,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) =>
      axiosSecure.patch(`/donation-requests/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(["allDonationRequests"]);
      Swal.fire("Updated!", "Donation status updated.", "success");
    },
    onError: () => Swal.fire("Error", "Failed to update status.", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => axiosSecure.delete(`/donation-requests/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["allDonationRequests"]);
      Swal.fire("Deleted!", "Request deleted successfully.", "success");
    },
    onError: () => Swal.fire("Error", "Failed to delete request.", "error"),
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the request.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(id);
    });
  };

  if (roleLoading || isLoading) return <Loading />;
  if (isError)
    return <p className="text-red-500 text-center">Failed to load requests.</p>;

  const { requests = [], totalPages = 1 } = data || {};

  const columns = [
    { header: "Recipient Name", accessor: "recipientName" },
    {
      header: "Location",
      accessor: "recipientDistrict",
      cell: (val, row) => `${row.recipientDistrict}, ${row.recipientUpazila}`,
    },
    {
      header: "Date",
      accessor: "donationDate",
      cell: (val) => (val ? new Date(val).toLocaleDateString() : "-"),
    },
    { header: "Time", accessor: "donationTime" },
    { header: "Blood Group", accessor: "bloodGroup" },
    {
      header: "Status",
      accessor: "status",
      cell: (val) => <span className="capitalize">{val}</span>,
    },
    {
      header: "Actions",
      accessor: "_id",
      cell: (id, row) => (
        <div className="flex flex-wrap gap-2">
          {row.status === "inprogress" && (
            <>
              <button
                className="btn btn-xs btn-success"
                title="Mark as Done"
                onClick={() =>
                  updateStatusMutation.mutate({ id, status: "done" })
                }
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                className="btn btn-xs btn-warning"
                title="Cancel Request"
                onClick={() =>
                  updateStatusMutation.mutate({ id, status: "canceled" })
                }
              >
                <XCircle className="w-4 h-4" />
              </button>
            </>
          )}

          {role === "admin" && (
            <>
              <button
                className="btn btn-xs btn-info"
                title="Edit Request"
                onClick={() =>
                  navigate(`/dashboard/donation-requests/${id}/edit`)
                }
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                className="btn btn-xs btn-error"
                title="Delete Request"
                onClick={() => handleDelete(id)}
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                className="btn btn-xs btn-primary"
                title="View Request"
                onClick={() => navigate(`/dashboard/donation-requests/${id}`)}
              >
                <Eye className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">All Blood Donation Requests</h2>

      <div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="select select-bordered w-full sm:max-w-xs"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      <Table
        columns={columns}
        data={requests}
        currentPage={currentPage}
        limit={limit}
        emptyMessage="No donation requests found."
      />

      {totalPages > 1 && (
        <div className="join mt-4 flex justify-center">
          <button
            className="join-item btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            «
          </button>
          <button className="join-item btn no-animation cursor-default">
            Page {currentPage} of {totalPages}
          </button>
          <button
            className="join-item btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            »
          </button>
        </div>
      )}
    </div>
  );
};

export default AllDonationRequests;

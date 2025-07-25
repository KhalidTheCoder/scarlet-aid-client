import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { AuthContext } from "../providers/AuthContext";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Title from "../components/Title";
import Loading from "../pages/Loading";
import Table from "../components/Table";
import Swal from "sweetalert2";
import { Check, Eye, Pencil, Trash2, XCircle } from "lucide-react";

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
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 10;

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

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) =>
      axiosSecure.patch(`/donation-requests/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(["myDonationRequests"]);
      Swal.fire("Updated!", "Donation status updated.", "success");
    },
    onError: () => Swal.fire("Error", "Failed to update status.", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) =>
      await axiosSecure.delete(`/donation-requests/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["myDonationRequests"]);
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

  if (isLoading) return <Loading />;
  if (isError)
    return <p className="text-red-500 text-center">Failed to load requests.</p>;

  const { requests = [], totalPages = 1 } = data || {};

  const columns = [
    { header: "Recipient", accessor: "recipientName" },
    {
      header: "Location",
      accessor: "recipientDistrict",
      cell: (val, row) => `${row.recipientDistrict}, ${row.recipientUpazila}`,
    },
    {
      header: "Date",
      accessor: "donationDate",
      cell: (val) => new Date(val).toLocaleDateString(),
    },
    { header: "Time", accessor: "donationTime" },
    { header: "Blood Group", accessor: "bloodGroup" },
    {
      header: "Status",
      accessor: "status",
      cell: (val) => <span className="capitalize">{val}</span>,
    },
    {
      header: "Donor Info",
      accessor: "donorName",
      cell: (_, row) =>
        row.status === "inprogress" ? (
          <div className="text-xs">
            <p>{row.donorName}</p>
            <p className="text-gray-500">{row.donorEmail}</p>
          </div>
        ) : (
          "-"
        ),
    },
    {
      header: "Actions",
      accessor: "actions",

      cell: (_, row) => (
        <div className="flex flex-wrap gap-2">
          {row.status === "inprogress" && (
            <>
              <button
                className="btn btn-xs btn-success"
                title="Mark as Done"
                onClick={() =>
                  updateStatusMutation.mutate({ id: row._id, status: "done" })
                }
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                className="btn btn-xs btn-warning"
                title="Cancel Request"
                onClick={() =>
                  updateStatusMutation.mutate({
                    id: row._id,
                    status: "canceled",
                  })
                }
              >
                <XCircle className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            className="btn btn-xs btn-info"
            title="Edit Request"
            onClick={() =>
              navigate(`/dashboard/donation-requests/${row._id}/edit`)
            }
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            className="btn btn-xs btn-error"
            title="Delete Request"
            onClick={() => handleDelete(row._id)}
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            className="btn btn-xs btn-primary"
            title="View Request"
            onClick={() => navigate(`/dashboard/donation-requests/${row._id}`)}
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-20">
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
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      <Table
        columns={columns}
        data={requests}
        currentPage={page}
        limit={limit}
        emptyMessage="No donation requests found."
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

export default MyDonationRequests;

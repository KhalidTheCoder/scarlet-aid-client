import React, { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import Loading from "../pages/Loading";
import { AuthContext } from "../providers/AuthContext";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Table from "./Table";
import { Check, Eye, Pencil, Trash2, XCircle } from "lucide-react";

const fetchRecentRequests = async ({ queryKey }) => {
  const [, { email }, axiosSecure] = queryKey;
  const res = await axiosSecure.get("/donation-requests/recent", {
    params: { email },
  });
  return res.data;
};

const DonorHome = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: recentRequests = [], isLoading } = useQuery({
    queryKey: ["recentDonationRequests", { email: user?.email }, axiosSecure],
    queryFn: fetchRecentRequests,
    enabled: !!user?.email,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await axiosSecure.patch(`/donation-requests/${id}`, {
        status,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["recentDonationRequests"]);
      Swal.fire("Updated!", "Donation request status updated.", "success");
    },
    onError: () => Swal.fire("Error!", "Failed to update status.", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.delete(`/donation-requests/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["recentDonationRequests"]);
      Swal.fire("Deleted!", "Donation request has been deleted.", "success");
    },
    onError: () => Swal.fire("Error!", "Failed to delete request.", "error"),
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
      accessor: "donorInfo",
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
      // cell: (_, row) => (
      //   <div className="flex flex-wrap gap-2">
      //     {row.status === "inprogress" && (
      //       <>
      //         <button
      //           className="btn btn-xs btn-success"
      //           onClick={() =>
      //             updateStatusMutation.mutate({ id: row._id, status: "done" })
      //           }
      //         >
      //           Done
      //         </button>
      //         <button
      //           className="btn btn-xs btn-warning"
      //           onClick={() =>
      //             updateStatusMutation.mutate({
      //               id: row._id,
      //               status: "canceled",
      //             })
      //           }
      //         >
      //           Cancel
      //         </button>
      //       </>
      //     )}
      //     <button
      //       className="btn btn-xs btn-info"
      //       onClick={() =>
      //         navigate(`/dashboard/donation-requests/${row._id}/edit`)
      //       }
      //     >
      //       Edit
      //     </button>
      //     <button
      //       className="btn btn-xs btn-error"
      //       onClick={() => handleDelete(row._id)}
      //     >
      //       Delete
      //     </button>
      //     <button
      //       className="btn btn-xs btn-primary"
      //       onClick={() => navigate(`/dashboard/donation-requests/${row._id}`)}
      //     >
      //       View
      //     </button>
      //   </div>
      // ),
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {user?.displayName || "Donor"}!
      </h1>

      {recentRequests.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">
            Your Recent Donation Requests
          </h2>
          <Table
            columns={columns}
            data={recentRequests}
            currentPage={1}
            limit={3}
          />

          <div className="mt-4 text-center">
            <Link
              to="/dashboard/my-donation-requests"
              className="btn bg-[#CD5656] text-white"
            >
              View My All Requests
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorHome;

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Table from "../components/Table";


const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const limit = 10;

  
  const { data: usersData, isLoading, isError } = useQuery({
    queryKey: ["users", page],
    queryFn: async () => {
      const res = await axiosSecure.get("/users", {
        params: { page, limit },
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  const users = usersData?.users || [];
  const totalPages = usersData?.totalPages || 1;

  // Mutations
  const updateStatus = useMutation({
    mutationFn: ({ id, status }) =>
      axiosSecure.patch(`/users/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      Swal.fire("Updated!", "User status updated.", "success");
    },
    onError: () => {
      Swal.fire("Error!", "Failed to update status.", "error");
    },
  });

  const updateRole = useMutation({
    mutationFn: ({ id, role }) =>
      axiosSecure.patch(`/users/${id}/role`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      Swal.fire("Updated!", "User role updated.", "success");
    },
    onError: () => {
      Swal.fire("Error!", "Failed to update role.", "error");
    },
  });

  const handleStatusChange = (id, newStatus) => {
    updateStatus.mutate({ id, status: newStatus });
  };

  const handleRoleChange = (id, newRole) => {
    updateRole.mutate({ id, role: newRole });
  };

  if (isLoading) return <p>Loading users...</p>;
  if (isError) return <p>Error loading users!</p>;

 
  const columns = [
    { header: "Avatar", accessor: "avatar", cell: (value, row) => (
        <img src={value || row.image} alt={row.name} className="w-10 h-10 rounded-full" />
      )
    },
    { header: "Email", accessor: "email" },
    { header: "Name", accessor: "name" },
    { header: "Role", accessor: "role", cell: (value) => <span className="capitalize">{value}</span> },
    { header: "Status", accessor: "status", cell: (value) => (
        <span
          className={`px-2 py-1 text-xs rounded-full font-medium ${
            value === "blocked"
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {value}
        </span>
      )
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (_, row) => (
        <div className="space-x-2 text-xs text-center">
          {row.status === "active" ? (
            <button
              onClick={() => handleStatusChange(row._id, "blocked")}
              className="btn btn-xs btn-outline btn-error"
              disabled={updateStatus.isLoading}
            >
              Block
            </button>
          ) : (
            <button
              onClick={() => handleStatusChange(row._id, "active")}
              className="btn btn-xs btn-outline btn-success"
              disabled={updateStatus.isLoading}
            >
              Unblock
            </button>
          )}

          {row.role === "donor" && (
            <button
              onClick={() => handleRoleChange(row._id, "volunteer")}
              className="btn btn-xs btn-outline"
              disabled={updateRole.isLoading}
            >
              Make Volunteer
            </button>
          )}

          {(row.role === "donor" || row.role === "volunteer") && (
            <button
              onClick={() => handleRoleChange(row._id, "admin")}
              className="btn btn-xs btn-outline"
              disabled={updateRole.isLoading}
            >
              Make Admin
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">All Users</h2>

      <Table
        columns={columns}
        data={users}
        currentPage={page}
        limit={limit}
        emptyMessage="No users found."
      />

     
      <div className="mt-4 flex items-center justify-center space-x-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="btn btn-sm"
        >
          Previous
        </button>
        <span>
          Page <strong>{page}</strong> of <strong>{totalPages}</strong>
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="btn btn-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllUsers;

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Table from "../components/Table";
import {
  Ban,
  CheckCircle2,
  Handshake,
  ShieldPlus,
  Settings2,
} from "lucide-react";
import Title from "../components/Title";
import Loading from "../pages/Loading";

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data: usersData,
    isLoading,
    isError,
  } = useQuery({
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

  if (isLoading) return <Loading></Loading>;
  if (isError) return <p>Error loading users!</p>;

  const columns = [
    {
      header: "Avatar",
      accessor: "avatar",
      cell: (value, row) => (
        <img
          src={value || row.image}
          alt={row.name}
          className="w-10 h-10 rounded-full"
        />
      ),
    },
    { header: "Email", accessor: "email" },
    { header: "Name", accessor: "name" },
    {
      header: "Role",
      accessor: "role",
      cell: (value) => <span className="capitalize">{value}</span>,
    },
    {
      header: "Status",
      accessor: "status",
      cell: (value) => (
        <span
          className={`px-2 py-1 text-xs rounded-full font-medium ${
            value === "blocked" ? "text-red-600" : "text-green-600"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (_, row) => (
      <div className="dropdown relative">
  <div
    tabIndex={0}
    role="button"
    className="btn btn-ghost btn-xs text-gray-600 hover:bg-gray-100"
  >
    <Settings2 size={16} />
  </div>

  <ul
  tabIndex={0}
  className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-56 text-sm 
             left-1/2 transform -translate-x-1/2 -mt-1"
>
    {row.status === "active" ? (
      <li>
        <button
          onClick={() => handleStatusChange(row._id, "blocked")}
          disabled={updateStatus.isLoading}
          className="text-red-500 flex gap-2 items-center"
        >
          <Ban size={16} /> Block
        </button>
      </li>
    ) : (
      <li>
        <button
          onClick={() => handleStatusChange(row._id, "active")}
          disabled={updateStatus.isLoading}
          className="text-green-600 flex gap-2 items-center"
        >
          <CheckCircle2 size={16} /> Unblock
        </button>
      </li>
    )}

    {row.role === "donor" && (
      <li>
        <button
          onClick={() => handleRoleChange(row._id, "volunteer")}
          disabled={updateRole.isLoading}
          className="flex gap-2 items-center"
        >
          <Handshake size={16} /> Make Volunteer
        </button>
      </li>
    )}

    {(row.role === "donor" || row.role === "volunteer") && (
      <li>
        <button
          onClick={() => handleRoleChange(row._id, "admin")}
          disabled={updateRole.isLoading}
          className="flex gap-2 items-center"
        >
          <ShieldPlus size={16} /> Make Admin
        </button>
      </li>
    )}
  </ul>
</div>

      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="mt-3 mb-12 flex justify-center">
              <Title>User Management</Title>
            </div>

      <Table
        columns={columns}
        data={users}
        currentPage={page}
        limit={limit}
        emptyMessage="No users found."
      />

      <div className="mt-4 flex items-center justify-center">
        <div className="join">
          <button
            className="join-item btn btn-sm"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            «
          </button>
          <button className="join-item btn btn-sm cursor-default">
            Page {page} of {totalPages}
          </button>
          <button
            className="join-item btn btn-sm"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;

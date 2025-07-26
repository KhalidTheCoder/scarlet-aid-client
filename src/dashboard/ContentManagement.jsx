import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useUserRole from "../hooks/useUserRole";
import Loading from "../pages/Loading";

const fetchBlogs = async ({ queryKey }) => {
  const [, filter, axiosSecure] = queryKey;
  const url = filter === "all" ? "/blogs" : `/blogs?status=${filter}`;
  const res = await axiosSecure.get(url);
  return res.data;
};

const ContentManagement = () => {
  const [filter, setFilter] = useState("all");
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { role, isLoading: roleLoading } = useUserRole();

  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ["blogs", filter, axiosSecure],
    queryFn: fetchBlogs,
  });

  // Mutations
  const publishMutation = useMutation({
    mutationFn: (id) =>
      axiosSecure.patch(`/blogs/${id}/status`, { status: "published" }),
    onSuccess: () => {
      Swal.fire("Success", "Blog published.", "success");
      queryClient.invalidateQueries(["blogs", filter, axiosSecure]);
    },
  });

  const unpublishMutation = useMutation({
    mutationFn: (id) =>
      axiosSecure.patch(`/blogs/${id}/status`, { status: "draft" }),
    onSuccess: () => {
      Swal.fire("Success", "Blog unpublished.", "success");
      queryClient.invalidateQueries(["blogs", filter, axiosSecure]);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/blogs/${id}`),
    onSuccess: () => {
      Swal.fire("Deleted!", "Blog deleted successfully.", "success");
      queryClient.invalidateQueries(["blogs", filter, axiosSecure]);
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the blog.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(id);
    });
  };

  if (isLoading || roleLoading) return <Loading />;

  return (
    <div className="px-4 py-8 sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Content Management</h1>
        <button
          onClick={() => navigate("/dashboard/add-blog")}
          className="btn bg-[#CD5656] text-white"
        >
          Add Blog
        </button>
      </div>

      <div className="mb-4">
        <label className="mr-2 font-medium">Filter:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full sm:max-w-xs px-4 py-2 font-medium bg-white text-[#362E24] text-sm rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#AF3E3E] transition-all duration-200"
        >
          <option value="all">All</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {blogs.length === 0 ? (
        <p className="text-gray-500">No blogs found.</p>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3 sm:max-w-sm sm:mx-auto lg:max-w-full">
         {blogs.map((blog) => (
  <div
    key={blog._id}
    className="card bg-base-100 w-full sm:w-96 shadow-sm"
  >
    <figure>
      <img
        src={blog.thumbnail}
        alt={blog.title}
        className="object-cover w-full h-48"
      />
    </figure>
    <div className="card-body">
      <h2 className="card-title">
        {blog.title}
        {blog.status === "published" && (
          <div className="badge badge-secondary">PUBLISHED</div>
        )}
        {blog.status === "draft" && (
          <div className="badge badge-outline">DRAFT</div>
        )}
      </h2>
  <p className="text-gray-700">
  {blog.content.replace(/<[^>]+>/g, "")}
</p>
      <div className="card-actions justify-end flex flex-wrap gap-2 mt-2">
        {role === "admin" && blog.status === "draft" && (
          <button
            onClick={() => publishMutation.mutate(blog._id)}
            className="btn btn-xs btn-success"
          >
            Publish
          </button>
        )}
        {role === "admin" && blog.status === "published" && (
          <button
            onClick={() => unpublishMutation.mutate(blog._id)}
            className="btn btn-xs btn-warning"
          >
            Unpublish
          </button>
        )}
        {role === "admin" && (
          <button
            onClick={() => handleDelete(blog._id)}
            className="btn btn-xs btn-error"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  </div>
))}
        </div>
      )}
    </div>
  );
};

export default ContentManagement;

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useUserRole from "../hooks/useUserRole";
import Loading from "../pages/Loading";
import Title from "../components/Title";

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
      <div className="flex justify-between items-center mb-10">
        <Title>Content Administration</Title>
        <button
          onClick={() => navigate("/dashboard/add-blog")}
          className="bg-[#F09410] hover:bg-[#BC430D] text-white px-4 py-2 rounded-md font-medium transition"
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
      className="bg-[#FDD0C7] rounded-2xl shadow-md w-full sm:w-96 transition-transform duration-200 hover:scale-[1.02]"
    >
      <figure className="rounded-t-2xl overflow-hidden">
        <img
          src={blog.thumbnail}
          alt={blog.title}
          className="object-cover w-full h-48"
        />
      </figure>

      <div className="p-4">
        <h2 className="text-lg font-semibold text-[#241705] flex items-center justify-between">
          {blog.title}
          {blog.status === "published" && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#F09410] text-white">
              PUBLISHED
            </span>
          )}
          {blog.status === "draft" && (
            <span className="text-xs px-2 py-0.5 rounded-full border border-[#F09410] text-[#F09410]">
              DRAFT
            </span>
          )}
        </h2>

        <p className="mt-2 text-sm text-[#241705] line-clamp-3">
          {blog.content.replace(/<[^>]+>/g, "")}
        </p>

        <div className="mt-4 flex flex-wrap justify-end gap-2">
          {role === "admin" && blog.status === "draft" && (
            <button
              onClick={() => publishMutation.mutate(blog._id)}
              className="px-3 py-1 text-xs rounded-full bg-[#F09410] hover:bg-[#BC430D] text-white transition"
            >
              Publish
            </button>
          )}

          {role === "admin" && blog.status === "published" && (
            <button
              onClick={() => unpublishMutation.mutate(blog._id)}
              className="px-3 py-1 text-xs rounded-full bg-[#FFF4E6] hover:bg-[#F09410] text-[#241705] border border-[#F09410] transition"
            >
              Unpublish
            </button>
          )}

          {role === "admin" && (
            <button
              onClick={() => handleDelete(blog._id)}
              className="px-3 py-1 text-xs rounded-full bg-red-500 hover:bg-red-600 text-white transition"
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

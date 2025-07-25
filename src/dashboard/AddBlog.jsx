import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import JoditEditor from "jodit-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useUserRole from "../hooks/useUserRole";
import Loading from "../pages/Loading";

const AddBlog = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { role, isLoading: roleLoading } = useUserRole();

  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [content, setContent] = useState("");

  const createBlogMutation = useMutation({
    mutationFn: async (newBlog) => {
      const res = await axiosSecure.post("/blogs", newBlog);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Success", "Blog created successfully!", "success");
      navigate("/dashboard/content-management");
    },
    onError: () => {
      Swal.fire("Error", "Failed to create blog. Try again.", "error");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (role !== "admin" && role !== "volunteer") {
      Swal.fire(
        "Access Denied",
        "You do not have permission to add blogs.",
        "error"
      );
      return;
    }

    if (!title || !thumbnail || !content) {
      Swal.fire("Error", "All fields are required.", "error");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", thumbnail);
      const imgRes = await fetch(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const imgData = await imgRes.json();
      if (!imgData.success) throw new Error("Image upload failed");

      const newBlog = {
        title,
        thumbnail: imgData.data.url,
        content,
        status: "draft",
      };

      createBlogMutation.mutate(newBlog);
    } catch (error) {
      Swal.fire("Error", error.message || "Image upload failed", "error");
    }
  };

  if (roleLoading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 bg-white shadow-lg rounded-2xl mt-25">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8 border-b pb-2">
        📝 Add New Blog
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Blog Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your blog title"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#CD5656] focus:border-transparent"
          />
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Thumbnail Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
            className="w-full px-4 py-2 file-input file-input-bordered rounded-lg shadow-sm"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Content
          </label>
          <div className="border rounded-lg overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-[#CD5656]">
            <JoditEditor
              value={content}
              onChange={(newContent) => setContent(newContent)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={createBlogMutation.isLoading}
          className="w-full py-3 px-6 bg-[#CD5656] text-white font-semibold rounded-lg shadow-md hover:bg-[#b64e4e] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createBlogMutation.isLoading ? "Creating..." : "Create Blog"}
        </button>
      </form>
    </div>
  );
};

export default AddBlog;

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import JoditEditor from "jodit-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useUserRole from "../hooks/useUserRole";
import Loading from "../pages/Loading";
import Title from "../components/Title";

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
    <div>
      <div className="pt-3 mb-12 flex justify-center">
        <Title>Start Writing Your Blog</Title>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-10 bg-[#FDD0C7] shadow-xl rounded-2xl mt-12">
        <h2 className="text-3xl font-bold text-[#241705] mb-8 border-b-2 border-[#F09410] pb-2">
          📝 Create a New Blog
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-[#241705] mb-2">
              Blog Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your blog title"
              className="w-full px-4 py-3 border border-[#F09410] rounded-lg bg-white text-[#241705] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F09410] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-[#241705] mb-2">
              Thumbnail Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files[0])}
              className="file-input file-input-bordered w-full border-[#F09410] bg-white text-[#241705] shadow-sm"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-[#241705] mb-2">
              Blog Content
            </label>
            <div className="border border-[#F09410] rounded-lg overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-[#F09410]">
              <JoditEditor
                value={content}
                onChange={(newContent) => setContent(newContent)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={createBlogMutation.isLoading}
            className="w-full py-3 px-6 bg-[#F09410] text-white font-semibold rounded-lg shadow-md hover:bg-[#BC430D] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createBlogMutation.isLoading ? "Creating..." : "Create Blog"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBlog;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import Loading from "../pages/Loading";
import useAxios from "../hooks/useAxios";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const axios = useAxios();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/blogs/public/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, axios]);

  if (loading) return <Loading />;

  if (!blog) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-500">Blog not found.</p>
        <button className="btn btn-primary mt-4" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="card bg-base-100 shadow-md">
        <figure>
          <img
            src={blog.thumbnail || "https://via.placeholder.com/800x400"}
            alt={blog.title}
            className="w-full h-64 object-cover"
          />
        </figure>
        <div className="card-body">
          <h1 className="card-title text-3xl font-bold">{blog.title}</h1>
          <p className="text-sm text-gray-500">
            By {blog.author?.name || "Unknown"} ·{" "}
            {new Date(blog.createdAt).toLocaleDateString()}
          </p>
          <div className="divider"></div>
          <div className="prose max-w-none text-gray-700">
            {blog.content}
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-center">
        <button className="btn btn-outline" onClick={() => navigate(-1)}>
          Back to Blogs
        </button>
      </div>
    </div>
  );
};

export default BlogDetails;
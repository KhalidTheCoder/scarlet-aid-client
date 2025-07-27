import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import Loading from "../pages/Loading";
import useAxios from "../hooks/useAxios";
import Title from "../components/Title";

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
   <div className="bg-[#FFF4E6] min-h-screen">
    <div className="pt-5 mb-15 flex justify-center">
          <Title>Complete Blog Perspective</Title>
        </div>
      <div className="max-w-3xl mx-auto p-4">
  <div className="card bg-[#FDD0C7] shadow-xl">
    <figure className="rounded-t-xl overflow-hidden">
      <img
        src={blog.thumbnail || "https://via.placeholder.com/800x400"}
        alt={blog.title}
        className="w-full h-64 object-cover transition duration-300 hover:scale-105"
      />
    </figure>
    <div className="card-body text-[#241705]">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">{blog.title}</h1>
      <p className="text-sm opacity-80 mb-4">
        By <span className="font-semibold">{blog.author?.name || "Unknown"}</span> ·{" "}
        {new Date(blog.createdAt).toLocaleDateString()}
      </p>
      <div className="border-b border-[#F09410] mb-4"></div>
      <div className="prose max-w-none text-[#241705]">
        {blog.content}
      </div>
    </div>
  </div>

  <div className="mt-6 flex justify-center">
    <button
      className="btn bg-[#F09410] text-white hover:bg-[#BC430D] px-6 py-2 rounded-full shadow-md transition border-none duration-300"
      onClick={() => navigate(-1)}
    >
      Back to Blogs
    </button>
  </div>
</div>
   </div>

  );
};

export default BlogDetails;
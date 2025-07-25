import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Loading from "../pages/Loading";
import useAxios from "../hooks/useAxios";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const axios = useAxios();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("/blogs/public", {
          params: { status: "published" }, // fetch only published blogs
        });
        setBlogs(res.data || []);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [axios]);

  if (loading) return <Loading />;

  if (blogs.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-10">No published blogs available.</p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {blogs.map((blog) => (
        <div
          key={blog._id}
          className="card bg-base-100 shadow-md hover:shadow-xl transition cursor-pointer"
          onClick={() => navigate(`/blogs/${blog._id}`)}
        >
          <figure className="h-48 overflow-hidden">
            <img
              src={blog.thumbnail || "https://via.placeholder.com/400x250"}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">{blog.title}</h2>
            <p className="text-gray-600 text-sm line-clamp-3">{blog.excerpt || blog.content}</p>
            <div className="card-actions justify-end">
              <button
                className="btn btn-primary btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/blog-details/${blog._id}`);
                }}
              >
                Read More
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Blog;

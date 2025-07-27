import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Loading from "../pages/Loading";
import useAxios from "../hooks/useAxios";
import Title from "../components/Title";

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
      <p className="text-center text-gray-500 mt-10">
        No published blogs available.
      </p>
    );
  }

  return (
    <div className="bg-[#FFF4E6] min-h-screen">
      <div>
        <div className="pt-5 mb-15 flex justify-center">
          <Title>The Lifeline Blog</Title>
        </div>
        <div className="max-w-7xl mx-auto p-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              onClick={() => navigate(`/blog-details/${blog._id}`)}
              className="bg-[#FDD0C7] rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col"
            >
              {/* Image */}
              <figure className="h-48 w-full">
                <img
                  src={blog.thumbnail || "https://via.placeholder.com/400x250"}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </figure>

              {/* Content */}
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-lg font-bold text-[#241705] mb-2 line-clamp-2">
                  {blog.title}
                </h2>
                <p className="text-sm text-[#241705] opacity-90 line-clamp-3 flex-grow">
                  {blog.excerpt || blog.content.replace(/<[^>]+>/g, "")}
                </p>

                <div className="mt-4 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/blog-details/${blog._id}`);
                    }}
                    className="inline-block bg-[#F09410] hover:bg-[#BC430D] text-white text-sm font-semibold py-1.5 px-4 rounded-full transition-colors duration-200"
                  >
                    Read More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;

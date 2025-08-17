import React, { useEffect, useState, useContext } from "react";
import useAxios from "../hooks/useAxios";
import { useNavigate } from "react-router";
import { AuthContext } from "../providers/AuthContext";
import {
  FaHeartbeat,
  FaHospitalUser,
  FaMapMarkerAlt,
  FaTint,
  FaEye,
} from "react-icons/fa";
import Loading from "../pages/Loading";


const RecentDonationsReq = () => {
  const axiosPublic = useAxios();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        setLoading(true);
        const res = await axiosPublic.get("/donation-requests/public", {
          params: { page: 1, limit: 4 },
        });
        setRecent(res.data.requests || []);
      } catch (err) {
        console.error("Failed to fetch recent donations", err);
        setRecent([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, [axiosPublic]);

  const handleView = (id) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/dashboard/donation-requests/${id}`);
    }
  };

  if (loading) return <Loading></Loading>;

  return (
    <section className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Title */}
      <h2 className="text-4xl md:text-5xl font-extrabold text-center text-[#D43F00] mb-4">
        Recent Donation Requests
      </h2>
      <p className="text-center text-gray-600 text-base sm:text-lg max-w-2xl mx-auto mb-10 font-medium">
        Stay updated with the latest donation needs. Check who urgently requires
        blood and see the details for each request.
      </p>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 font-medium gap-6">
        {recent.length === 0 && (
          <p className="text-gray-500 col-span-full text-center">
            No recent donation requests found.
          </p>
        )}

        {recent.map((req) => (
          <div
            key={req._id}
            className="bg-[#FFF7F1] shadow-lg rounded-2xl p-6 hover:shadow-2xl transition transform hover:-translate-y-1 flex flex-col justify-between"
          >
            <div className="flex items-center gap-3 mb-4">
              <FaHeartbeat className="text-[#D43F00] text-2xl" />
              <h3 className="text-lg font-bold text-[#241705]">
                {req.recipientName}
              </h3>
            </div>

            <div className="space-y-2 text-sm text-gray-700">
              <p className="flex items-center gap-2">
                <FaHospitalUser className="text-[#F09410]" /> {req.hospitalName}
              </p>
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#D43F00]" />{" "}
                {req.recipientDistrict}, {req.recipientUpazila}
              </p>
              <p className="flex items-center gap-2">
                <FaTint className="text-[#F09410]" /> {req.bloodGroup} Blood
              </p>
            </div>

            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-gray-500">
                Requested on {new Date(req.createdAt).toLocaleDateString()}
              </p>
              <button
                onClick={() => handleView(req._id)}
                className="flex items-center gap-1 text-[#D43F00] font-semibold hover:text-[#A53000] transition"
              >
                <FaEye /> View
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={() => navigate("/donationRequest")}
          className="px-6 py-3 bg-[#F09410] hover:bg-[#BC430D] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition"
        >
          View All Donation Requests
        </button>
      </div>
    </section>
  );
};

export default RecentDonationsReq;

import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { AuthContext } from "../providers/AuthContext";
import useAxios from "../hooks/useAxios";
import Loading from "../pages/Loading";
import Table from "../components/Table";
import { Eye } from "lucide-react";
import Title from "../components/Title";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const fetchDistricts = async () => {
  const res = await fetch("/district.json");
  if (!res.ok) throw new Error("Failed to fetch districts");
  const json = await res.json();
  const table = json.find(
    (item) => item.type === "table" && item.name === "districts"
  );
  return table?.data || [];
};

const fetchPendingRequests = async ({ queryKey }) => {
  const [, { page, limit, bloodGroup, district }, axios] = queryKey;
  const res = await axios.get("/donation-requests/public", {
    params: {
      status: "pending",
      page,
      limit,
      bloodGroup: bloodGroup || "",
      district: district || "",
    },
  });
  return res.data;
};

const DonationRequests = () => {
  const axios = useAxios();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [page, setPage] = useState(1);
  const limit = 10;

  const [filters, setFilters] = useState({
    bloodGroup: "",
    district: "",
  });

  const [districts, setDistricts] = useState([]);
  useEffect(() => {
    fetchDistricts().then(setDistricts).catch(console.error);
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["pendingDonationRequests", { page, limit, ...filters }, axios],
    queryFn: fetchPendingRequests,
    keepPreviousData: true,
  });

  const handleView = (id) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/dashboard/donation-requests/${id}`);
    }
  };

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <p className="text-center text-red-500">
        Failed to load donation requests.
      </p>
    );

  const requests = data?.requests || [];
  const totalPages = data?.totalPages || 1;

  const columns = [
    { header: "Recipient", accessor: "recipientName" },
    {
      header: "Location",
      accessor: "recipientDistrict",
      cell: (_, row) => `${row.recipientDistrict}, ${row.recipientUpazila}`,
    },
    { header: "Blood Group", accessor: "bloodGroup" },
    {
      header: "Date",
      accessor: "donationDate",
      cell: (val) => new Date(val).toLocaleDateString(),
    },
    { header: "Time", accessor: "donationTime" },
    {
      header: "View",
      accessor: "view",
      cell: (_, row) => (
        <button
          className="btn border-none btn-xs bg-[#362E24] text-white hover:bg-[#2D241B]"
          title="View Request"
          onClick={() => handleView(row._id)}
        >
          <Eye className="w-4 h-4"></Eye>
        </button>
      ),
    },
  ];

  return (
    <div className="bg-[#FFF4E6] min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mt-5 mb-15 flex justify-center">
          <Title>Pending Donation Requests</Title>
        </div>

        <div className="flex justify-center items-center gap-5 mb-6">
          <select
            className="w-full sm:max-w-xs px-4 py-2 font-medium bg-white text-[#362E24] text-sm rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#AF3E3E] transition-all duration-200"
            value={filters.bloodGroup}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, bloodGroup: e.target.value }))
            }
          >
            <option value="">All Blood Group</option>
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>

          <select
            className="w-full sm:max-w-xs px-4 py-2 font-medium bg-white text-[#362E24] text-sm rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#AF3E3E] transition-all duration-200"
            value={filters.district}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, district: e.target.value }))
            }
          >
            <option value="">All District</option>
            {districts.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <Table
          columns={columns}
          data={requests}
          currentPage={page}
          limit={limit}
          emptyMessage="No pending donation requests."
        />

        {totalPages > 1 && (
          <div className="join mt-6 flex justify-center">
            <button
              className="join-item btn"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              «
            </button>
            <button className="join-item btn">
              Page {page} of {totalPages}
            </button>
            <button
              className="join-item btn"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              »
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationRequests;

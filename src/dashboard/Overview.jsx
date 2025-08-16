import React, { useContext, useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import {
  FaClipboardList,
  FaHourglassHalf,
  FaCheckCircle,
} from "react-icons/fa";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../providers/AuthContext";
import Loading from "../pages/Loading";
import Title from "../components/Title";

const COLORS = ["#FFBB28", "#00C49F", "#0088FE"];

const Overview = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchRequests = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get("/donation-requests/my-requests", {
          params: { email: user.email, limit: 1000 },
        });
        setRequests(res.data.requests || []);
      } catch (error) {
        console.error("Failed to fetch donation requests:", error);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user?.email, axiosSecure]);

  if (authLoading || loading) {
    return <Loading />;
  }

  const totalRequested = requests.length;
  const inprogress = requests.filter((r) => r.status === "inprogress").length;
  const totalDone = requests.filter((r) => r.status === "done").length;

  const pieData = [
    { name: "Requested", value: totalRequested },
    { name: "In Progress", value: inprogress },
    { name: "Completed", value: totalDone },
  ];

  const grouped = requests.reduce((acc, r) => {
    const month = dayjs(r.createdAt).format("MMM YYYY");
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});
  const lineData = Object.entries(grouped).map(([month, count]) => ({
    month,
    count,
  }));

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="my-5 flex justify-center">
        <Title>Quick Overview</Title>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-12">
        <StatCard
          title="Total Requests"
          value={totalRequested}
          description="Total donation requests submitted. Track your activity and stay informed about all your requests"
          color="bg-yellow-100"
          text="text-yellow-600"
          icon={<FaClipboardList size={28} />}
        />
        <StatCard
          title="In Progress"
          value={inprogress}
          description="Requests currently being processed. Monitor active donations and stay updated on their progress."
          color="bg-blue-100"
          text="text-blue-600"
          icon={<FaHourglassHalf size={28} />}
        />
        <StatCard
          title="Completed"
          value={totalDone}
          description="Requests that have been successfully completed. Review finalized donations and track achievements."
          color="bg-green-100"
          text="text-green-600"
          icon={<FaCheckCircle size={28} />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white shadow rounded-2xl p-4 sm:p-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-4 text-center sm:text-left">
            Donation Status Distribution
          </h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius="40%"
                  outerRadius="70%"
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-white shadow rounded-2xl p-4 sm:p-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-4 text-center sm:text-left">
            Donations Over Time
          </h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#0088FE"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

function StatCard({ title, value, color, text, icon, description }) {
  return (
    <div
      className={`shadow rounded-2xl p-6 flex flex-col items-center justify-center transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${color}`}
    >
      <div className="mb-3">{icon}</div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>

      <p className={`text-4xl font-bold ${text}`}>{value}</p>
      <p className="mt-2 text-sm text-gray-600 font-medium text-center">
        {description}
      </p>
    </div>
  );
}

export default Overview;

import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import {
  BiUser,
  BiEnvelope,
  BiMap,
  BiMapAlt,
  BiDroplet,
  BiTime,
  BiCalendar,
} from "react-icons/bi";
import { AuthContext } from "../providers/AuthContext";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Title from "../components/Title";

const fetchDistricts = async () => {
  const res = await fetch("/district.json");
  if (!res.ok) throw new Error("Failed to fetch districts");
  const json = await res.json();
  const table = json.find(
    (item) => item.type === "table" && item.name === "districts"
  );
  return table?.data || [];
};

const fetchUpazilas = async () => {
  const res = await fetch("/upazilas.json");
  if (!res.ok) throw new Error("Failed to fetch upazilas");
  const json = await res.json();
  const table = json.find(
    (item) => item.type === "table" && item.name === "upazilas"
  );
  return table?.data || [];
};

const CreateDonationRequest = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [selectedDistrictId, setSelectedDistrictId] = useState("");

  const { data: districts = [] } = useQuery({
    queryKey: ["districts"],
    queryFn: fetchDistricts,
  });

  const { data: allUpazilas = [] } = useQuery({
    queryKey: ["upazilas"],
    queryFn: fetchUpazilas,
  });

  const upazilas = allUpazilas.filter(
    (u) => String(u.district_id) === String(selectedDistrictId)
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosSecure.post("/donation-requests", data);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Success!", "Donation request created!", "success");
      navigate("/dashboard/my-donation-requests");
      reset();
    },
    onError: (err) => {
      Swal.fire(
        "Error!",
        err.response?.data?.message || "Failed to submit",
        "error"
      );
    },
  });

  const onSubmit = (data) => {
    if (user?.status === "blocked") {
      Swal.fire(
        "Access Denied!",
        "Blocked users cannot create donation requests.",
        "error"
      );
      return;
    }

    const payload = {
      ...data,
      requesterName: user?.name,
      requesterEmail: user?.email,
      status: "pending",
    };

    mutate(payload);
  };

  return (
    <div className="w-full overflow-x-hidden">
      <div className="pt-3 mb-12 flex justify-center">
        <Title>Create Donation Request</Title>
      </div>
      <div className="w-full max-w-5xl mx-auto px-4 py-8 bg-[#FDD0C7] shadow-xl rounded-2xl mt-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#241705] border-b-2 border-[#F09410] inline-block pb-2">
            Details & Info
          </h2>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="flex flex-col">
            <label className="font-semibold text-[#241705] flex items-center gap-2">
              <BiUser /> Requester Name
            </label>
            <input
              type="text"
              value={user?.displayName || ""}
              readOnly
              className="w-full px-4 py-2 border border-[#F09410] rounded-lg bg-gray-100 text-[#241705] shadow-sm"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-[#241705] flex items-center gap-2">
              <BiEnvelope /> Requester Email
            </label>
            <input
              type="email"
              value={user?.email || ""}
              readOnly
              className="w-full px-4 py-2 border border-[#F09410] rounded-lg bg-gray-100 text-[#241705] shadow-sm"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-[#241705]">
              Recipient Name
            </label>
            <input
              {...register("recipientName", { required: true })}
              placeholder="Recipient Full Name"
              className="w-full px-4 py-2 border border-[#F09410] rounded-lg bg-white text-[#241705] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F09410]"
            />
            {errors.recipientName && (
              <span className="text-sm text-red-500 mt-1">Required</span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-[#241705] flex items-center gap-2">
              <BiMap /> District
            </label>
            <select
              {...register("recipientDistrict", { required: true })}
              onChange={(e) => {
                const id =
                  districts.find((d) => d.name === e.target.value)?.id || "";
                setSelectedDistrictId(id);
                register("recipientDistrict").onChange(e);
              }}
              className="w-full px-4 py-2 border border-[#F09410] rounded-lg bg-white text-[#241705] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F09410]"
            >
              <option value="">Select District</option>
              {districts.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-[#241705] flex items-center gap-2">
              <BiMapAlt /> Upazila
            </label>
            <select
              {...register("recipientUpazila", { required: true })}
              className="w-full px-4 py-2 border border-[#F09410] rounded-lg bg-white text-[#241705] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F09410]"
            >
              <option value="">Select Upazila</option>
              {upazilas.map((u) => (
                <option key={u.id} value={u.name}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-[#241705]">
              Hospital Name
            </label>
            <input
              {...register("hospitalName", { required: true })}
              placeholder="e.g. Dhaka Medical College"
              className="w-full px-4 py-2 border border-[#F09410] rounded-lg bg-white text-[#241705] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F09410]"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-[#241705]">Full Address</label>
            <input
              {...register("fullAddress", { required: true })}
              placeholder="e.g. Zahir Raihan Rd, Dhaka"
              className="w-full px-4 py-2 border border-[#F09410] rounded-lg bg-white text-[#241705] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F09410]"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-[#241705] flex items-center gap-2">
              <BiDroplet /> Blood Group
            </label>
            <select
              {...register("bloodGroup", { required: true })}
              className="w-full px-4 py-2 border border-[#F09410] rounded-lg bg-white text-[#241705] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F09410]"
            >
              <option value="">Select Group</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-[#241705] flex items-center gap-2">
              <BiCalendar /> Date
            </label>
            <input
              type="date"
              {...register("donationDate", { required: true })}
              className="w-full px-4 py-2 border border-[#F09410] rounded-lg bg-white text-[#241705] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F09410]"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-[#241705] flex items-center gap-2">
              <BiTime /> Time
            </label>
            <input
              type="time"
              {...register("donationTime", { required: true })}
              className="w-full px-4 py-2 border border-[#F09410] rounded-lg bg-white text-[#241705] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F09410]"
            />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className="font-semibold text-[#241705]">
              Request Message
            </label>
            <textarea
              {...register("requestMessage", { required: true })}
              rows={4}
              placeholder="Explain why you need the blood in detail..."
              className="w-full px-4 py-3 border border-[#F09410] rounded-lg bg-white text-[#241705] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F09410]"
            />
          </div>

          <div className="md:col-span-2 text-right">
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-3 bg-[#F09410] text-white font-semibold rounded-lg shadow-md hover:bg-[#BC430D] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDonationRequest;

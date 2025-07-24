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
  const res = await fetch("/src/assets/districtsAndUpazilas/district.json");
  if (!res.ok) throw new Error("Failed to fetch districts");
  const json = await res.json();
  const table = json.find(
    (item) => item.type === "table" && item.name === "districts"
  );
  return table?.data || [];
};

const fetchUpazilas = async () => {
  const res = await fetch("/src/assets/districtsAndUpazilas/upazilas.json");
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
    <div className="min-h-screen py-10">
      <div className="w-11/12 md:w-4/5 mx-auto bg-white p-8 shadow rounded-2xl">
        <Title>Create Donation Request</Title>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6"
        >
          
          <div className="flex flex-col">
            <label className="font-medium flex items-center gap-2">
              <BiUser /> Requester Name
            </label>
            <input
              type="text"
              value={user?.displayName || ""}
              readOnly
              className="input input-bordered bg-gray-100"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium flex items-center gap-2">
              <BiEnvelope /> Requester Email
            </label>
            <input
              type="email"
              value={user?.email || ""}
              readOnly
              className="input input-bordered bg-gray-100"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium">Recipient Name</label>
            <input
              {...register("recipientName", { required: true })}
              className="input input-bordered"
              placeholder="Recipient Full Name"
            />
            {errors.recipientName && (
              <span className="text-sm text-red-500">Required</span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="font-medium flex items-center gap-2">
              <BiMap /> District
            </label>
            <select
              {...register("recipientDistrict", { required: true })}
              className="select select-bordered"
              onChange={(e) => {
                const id =
                  districts.find((d) => d.name === e.target.value)?.id || "";
                setSelectedDistrictId(id);
              }}
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
            <label className="font-medium flex items-center gap-2">
              <BiMapAlt /> Upazila
            </label>
            <select
              {...register("recipientUpazila", { required: true })}
              className="select select-bordered"
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
            <label className="font-medium">Hospital Name</label>
            <input
              {...register("hospitalName", { required: true })}
              className="input input-bordered"
              placeholder="e.g. Dhaka Medical College"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium">Full Address</label>
            <input
              {...register("fullAddress", { required: true })}
              className="input input-bordered"
              placeholder="e.g. Zahir Raihan Rd, Dhaka"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium flex items-center gap-2">
              <BiDroplet /> Blood Group
            </label>
            <select
              {...register("bloodGroup", { required: true })}
              className="select select-bordered"
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
            <label className="font-medium flex items-center gap-2">
              <BiCalendar /> Date
            </label>
            <input
              type="date"
              {...register("donationDate", { required: true })}
              className="input input-bordered"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium flex items-center gap-2">
              <BiTime /> Time
            </label>
            <input
              type="time"
              {...register("donationTime", { required: true })}
              className="input input-bordered"
            />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className="font-medium">Request Message</label>
            <textarea
              {...register("requestMessage", { required: true })}
              className="textarea textarea-bordered"
              rows={4}
              placeholder="Explain why you need the blood in detail..."
            />
          </div>

          <div className="md:col-span-2 text-right">
            <button
              type="submit"
              disabled={isPending}
              className="btn btn-primary"
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

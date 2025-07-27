import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import Loading from "../pages/Loading";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Title from "../components/Title";

const fetchDonationRequestById = async ({ queryKey }) => {
  const [, id, axiosSecure] = queryKey;
  const res = await axiosSecure.get(`/donation-requests/${id}`);
  return res.data;
};

const fetchDistricts = async () => {
  const res = await fetch("/src/assets/districtsAndUpazilas/district.json");
  const json = await res.json();
  return (
    json.find((item) => item.type === "table" && item.name === "districts")
      ?.data || []
  );
};

const fetchUpazilas = async () => {
  const res = await fetch("/src/assets/districtsAndUpazilas/upazilas.json");
  const json = await res.json();
  return (
    json.find((item) => item.type === "table" && item.name === "upazilas")
      ?.data || []
  );
};

const EditDonationRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [selectedDistrictId, setSelectedDistrictId] = useState("");

  const { data: request, isLoading } = useQuery({
    queryKey: ["donationRequest", id, axiosSecure],
    queryFn: fetchDonationRequestById,
    enabled: !!id,
  });

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

  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    if (request && districts.length > 0) {
      reset(request);

      const districtId =
        districts.find((d) => d.name === request.recipientDistrict)?.id || "";
      setSelectedDistrictId(districtId);
    }
  }, [request, districts, reset]);

  useEffect(() => {
    if (request && upazilas.length > 0) {
      const exists = upazilas.some((u) => u.name === request.recipientUpazila);
      if (exists) {
        setValue("recipientUpazila", request.recipientUpazila);
      }
    }
  }, [upazilas, request, setValue]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosSecure.put(`/donation-requests/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire(
        "Success!",
        "Donation request updated successfully.",
        "success"
      );
      navigate(`/dashboard/donation-requests/${id}`);
    },
    onError: () => {
      Swal.fire("Error!", "Failed to update donation request.", "error");
    },
  });

  if (isLoading) return <Loading />;

  if (!request)
    return <p className="text-center text-gray-500">Request not found.</p>;

  if (request.status !== "pending") {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">Edit Not Allowed</h2>
        <p className="text-gray-500">
          This request cannot be edited because it is {request.status}.
        </p>
      </div>
    );
  }

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <div className="">
      <div className="pt-3 mb-12 flex justify-center">
        <Title>Edit Donation Request</Title>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-[#FDD0C7] max-w-3xl mx-auto p-6 md:p-8 rounded-2xl shadow-xl"
      >
        <div>
          <label className="block text-[#241705] font-semibold mb-2">
            Recipient Name
          </label>
          <input
            type="text"
            {...register("recipientName", { required: true })}
            placeholder="Enter recipient full name"
            className="w-full px-4 py-2 border border-[#F09410] rounded-lg bg-white text-[#241705] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F09410]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#241705] font-semibold mb-2">
              Recipient District
            </label>
            <select
              {...register("recipientDistrict", { required: true })}
              onChange={(e) => {
                const districtId =
                  districts.find((d) => d.name === e.target.value)?.id || "";
                setSelectedDistrictId(districtId);
                setValue("recipientUpazila", "");
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

          <div>
            <label className="block text-[#241705] font-semibold mb-2">
              Recipient Upazila
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
        </div>

        <div>
          <label className="block text-[#241705] font-semibold mb-2">
            Hospital Name
          </label>
          <input
            type="text"
            {...register("hospitalName", { required: true })}
            placeholder="e.g. Dhaka Medical College"
            className="w-full px-4 py-2 border border-[#F09410] rounded-lg bg-white text-[#241705] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F09410]"
          />
        </div>

        <div>
          <label className="block text-[#241705] font-semibold mb-2">
            Full Address
          </label>
          <textarea
            {...register("fullAddress", { required: true })}
            placeholder="e.g. Zahir Raihan Rd, Dhaka"
            className="w-full px-4 py-2 border border-[#F09410] rounded-lg bg-white text-[#241705] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F09410]"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#241705] font-semibold mb-2">
              Donation Date
            </label>
            <input
              type="date"
              {...register("donationDate", { required: true })}
              className="w-full px-4 py-2 border border-[#F09410] rounded-lg bg-white text-[#241705] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F09410]"
            />
          </div>
          <div>
            <label className="block text-[#241705] font-semibold mb-2">
              Donation Time
            </label>
            <input
              type="time"
              {...register("donationTime", { required: true })}
              className="w-full px-4 py-2 border border-[#F09410] rounded-lg bg-white text-[#241705] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F09410]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[#241705] font-semibold mb-2">
            Blood Group
          </label>
          <select
            {...register("bloodGroup", { required: true })}
            className="w-full px-4 py-2 border border-[#F09410] rounded-lg bg-white text-[#241705] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F09410]"
          >
            <option value="">Select Blood Group</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[#241705] font-semibold mb-2">
            Request Message
          </label>
          <textarea
            {...register("requestMessage", { required: true })}
            placeholder="Explain why you need the blood in detail..."
            className="w-full px-4 py-3 border border-[#F09410] rounded-lg bg-white text-[#241705] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F09410]"
            rows={4}
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#F09410] hover:bg-[#BC430D] text-white font-semibold rounded-lg shadow-md transition duration-200"
        >
          Update Donation Request
        </button>
      </form>
    </div>
  );
};

export default EditDonationRequest;

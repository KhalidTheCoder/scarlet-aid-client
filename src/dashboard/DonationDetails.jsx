import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Loading from "../pages/Loading";
import { AuthContext } from "../providers/AuthContext";

// Icons
import {
  BiUser,
  BiMap,
  BiCalendar,
  BiTime,
  BiDroplet,
  BiMessageDetail,
  BiEnvelope,
} from "react-icons/bi";
import { FaHospitalSymbol } from "react-icons/fa";
import Title from "../components/Title";

const fetchDonationDetails = async ({ queryKey }) => {
  const [, id, axiosSecure] = queryKey;
  const res = await axiosSecure.get(`/donation-requests/${id}`);
  return res.data;
};

const DonationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const { data: donation, isLoading } = useQuery({
    queryKey: ["donationDetails", id, axiosSecure],
    queryFn: fetchDonationDetails,
    enabled: !!id,
  });

  const donateMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosSecure.patch(`/donation-requests/${id}/donate`, {
        donorName: user?.displayName,
        donorEmail: user?.email,
      });
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Donation Confirmed",
        text: "Thank you! Your donation has been successfully recorded.",
      });
      navigate("/dashboard");
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Confirmation Failed",
        text: "We couldn't confirm your donation at this time. Please try again later.",
      });
    },
  });

  const handleDonate = () => {
    Swal.fire({
      title: "Confirm Donation?",
      html: `
        <div class="text-left text-base">
          <p><strong>Donor Name:</strong> ${user?.displayName}</p>
          <p><strong>Donor Email:</strong> ${user?.email}</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Donate",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#CD5656",
    }).then((result) => {
      if (result.isConfirmed) {
        donateMutation.mutate();
      }
    });
  };

  if (isLoading) return <Loading />;
  if (!donation)
    return (
      <p className="text-center text-gray-500">Donation request not found.</p>
    );

  const {
    recipientName,
    recipientDistrict,
    recipientUpazila,
    hospitalName,
    fullAddress,
    donationDate,
    donationTime,
    bloodGroup,
    requestMessage,
    status,
    requesterName,
    requesterEmail,
  } = donation;

  return (
    <div className="">
      <div className="pt-3 mb-12 flex justify-center">
        <Title>Donation Request Overview</Title>
      </div>
      <div className="flex justify-center items-center mt-20 px-4">
        <div className="bg-gradient-to-br from-[#FDD0C7] via-[#FEE5DA] to-[#FDD0C7] shadow-2xl rounded-2xl max-w-4xl w-full p-8 md:p-10 text-[#241705]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white/70 rounded-xl p-5 shadow-sm border border-[#F09410]/20">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#BC430D]">
                <BiUser /> Recipient Info
              </h3>
              <p className="font-medium flex items-center gap-2">
                <BiUser className="text-[#F09410]" /> {recipientName}
              </p>
              <p className="font-medium flex items-center gap-2">
                <BiMap className="text-[#F09410]" /> {recipientDistrict},{" "}
                {recipientUpazila}
              </p>
              <p className="font-medium flex items-center gap-2">
                <BiMap className="text-[#F09410]" /> {fullAddress}
              </p>
            </div>

            <div className="bg-white/70 rounded-xl p-5 shadow-sm border border-[#F09410]/20">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#BC430D]">
                <BiCalendar /> Donation Info
              </h3>
              <p className="font-medium flex items-center gap-2">
                <BiCalendar className="text-[#F09410]" /> {donationDate}
              </p>
              <p className="font-medium flex items-center gap-2">
                <BiTime className="text-[#F09410]" /> {donationTime}
              </p>
              <p className="font-medium flex items-center gap-2">
                <FaHospitalSymbol className="text-[#F09410]" /> {hospitalName}
              </p>
              <p className="font-medium flex items-start gap-2">
                <BiMessageDetail className="text-[#F09410] mt-1" />{" "}
                {requestMessage}
              </p>
            </div>
          </div>

          <div className="my-8 border-t border-2 border-[#F09410]/40"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/70 rounded-xl p-5 shadow-sm border border-[#F09410]/20">
              <h4 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#BC430D]">
                <BiUser /> Requester Info
              </h4>
              <p className="font-medium flex items-center gap-2">
                <BiUser className="text-[#F09410]" /> {requesterName}
              </p>
              <p className="font-medium flex items-center gap-2">
                <BiEnvelope className="text-[#F09410]" /> {requesterEmail}
              </p>
            </div>

            <div className="flex flex-col gap-5 justify-center bg-white/70 rounded-xl p-5 shadow-sm border border-[#F09410]/20">
              <p className="font-semibold text-lg flex items-center gap-2">
                <BiDroplet className="text-[#BC430D]" /> Blood Group:{" "}
                <span className="ml-2 bg-[#FDD0C7] text-[#241705] px-4 py-1 rounded-lg shadow-sm border border-[#F09410]">
                  {bloodGroup}
                </span>
              </p>
              <p className="font-semibold text-lg flex items-center gap-2">
                Status:
                <span
                  className={`ml-2 px-4 py-1 rounded-lg shadow-sm ${
                    status === "pending"
                      ? "bg-yellow-200 text-yellow-900 border border-yellow-300"
                      : "bg-green-200 text-green-900 border border-green-300"
                  }`}
                >
                  {status}
                </span>
              </p>
            </div>
          </div>

          {status === "pending" && (
            <div className="mt-10">
              <button
                onClick={handleDonate}
                className="w-full py-3 bg-[#F09410] hover:bg-[#BC430D] text-white text-lg font-bold rounded-xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-0.5 duration-300"
              >
                Confirm Donation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationDetails;

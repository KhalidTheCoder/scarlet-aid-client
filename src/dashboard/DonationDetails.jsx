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
      Swal.fire("✅ Success!", "You have confirmed your donation.", "success");
      navigate("/dashboard");
    },
    onError: () => {
      Swal.fire("❌ Error!", "Failed to confirm donation.", "error");
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

       <div className="flex justify-center items-center mt-20">
        <div className="bg-white shadow-2xl rounded-xl max-w-4xl w-full p-10 border border-gray-200 text-gray-800">
        <h2 className="text-3xl font-bold text-center text-black mb-8 flex items-center justify-center gap-2">
          <BiDroplet className="text-4xl" /> Donation Request Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-base">
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BiUser className="text-red-600" /> Recipient Info
            </h3>
            <p className="font-medium">
              <BiUser className="inline mr-1" /> {recipientName}
            </p>
            <p className="font-medium">
              <BiMap className="inline mr-1" /> {recipientDistrict},{" "}
              {recipientUpazila}
            </p>
            <p className="font-medium">
              <BiMap className="inline mr-1" /> {fullAddress}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BiCalendar className="text-red-600" /> Donation Info
            </h3>
            <p className="font-medium">
              <BiCalendar className="inline mr-1" /> {donationDate}
            </p>
            <p className="font-medium">
              <BiTime className="inline mr-1" /> {donationTime}
            </p>
            <p className="font-medium">
              <FaHospitalSymbol className="inline mr-1" /> {hospitalName}
            </p>
            <p className="font-medium">
              <BiMessageDetail className="inline mr-1" /> {requestMessage}
            </p>
          </div>
        </div>

        <div className="divider my-6"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
          <div>
            <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <BiUser className="text-red-600" /> Requester Info
            </h4>
            <p className="font-medium">
              <BiUser className="inline mr-1" /> {requesterName}
            </p>
            <p className="font-medium">
              <BiEnvelope className="inline mr-1" /> {requesterEmail}
            </p>
          </div>

          <div className="flex flex-col gap-3 justify-center">
            <p className="font-semibold text-lg">
              <BiDroplet className="inline mr-1 text-red-600" /> Blood Group:{" "}
              <span className="badge bg-gray-200 text-black ml-2">
                {bloodGroup}
              </span>
            </p>
            <p className="font-semibold text-lg">
              Status:{" "}
              <span
                className={`badge ml-2 ${
                  status === "pending" ? "badge-warning" : "badge-success"
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
              className="btn bg-[#CD5656] btn-lg w-full text-white text-lg font-semibold tracking-wide shadow-md hover:shadow-xl transition duration-300"
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

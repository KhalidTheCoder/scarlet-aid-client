import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Loading from "../pages/Loading";
import Table from "../components/Table";
import useAxiosSecure from "../hooks/useAxiosSecure";
import CheckoutForm from "../components/CheckoutForm ";
import Title from "../components/Title";

const stripePromise = loadStripe(
  "pk_test_51Rp6yjCkTGWriOGkAHWLuOvFqw5iD1ZOQWzleB0SgwE6u0EMKtwrpMi3eiRCxIwJEaXBYgXdRwGA47kFiQRN7exB00O0s0y5ah"
);

const fetchFunds = async ({ queryKey }) => {
  const [, { page, limit }, axiosSecure] = queryKey;
  const res = await axiosSecure.get("/funding", {
    params: { page, limit },
  });
  return res.data;
};

const Funding = () => {
  const axiosSecure = useAxiosSecure();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState(20);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["funding", { page, limit }, axiosSecure],
    queryFn: fetchFunds,
    keepPreviousData: true,
  });

  const { funds = [], totalPages = 1 } = data || {};

  const columns = [
    { header: "Name", accessor: "userName" },
    { header: "Amount (USD)", accessor: "amount" },
    {
      header: "Date",
      accessor: "date",
      cell: (val) => new Date(val).toLocaleDateString(),
    },
  ];

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <p className="text-center text-red-500 mt-6">
        Failed to load funding records.
      </p>
    );

  return (
    <div className="bg-[#FFF4E6] min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mt-5 mb-15 flex justify-center">
          <Title>Together We Can Do More</Title>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#241705]">Funding</h1>
          <button
            className="bg-[#F09410] hover:bg-[#BC430D] text-white px-4 py-2 rounded-md font-medium transition"
            onClick={() => setIsModalOpen(true)}
          >
            Give Fund
          </button>
        </div>

        {funds.length > 0 ? (
          <Table
            columns={columns}
            data={funds}
            currentPage={page}
            limit={limit}
            emptyMessage="No funding records found."
          />
        ) : (
          <p className="text-center text-gray-500 mt-6">
            No funding records found.
          </p>
        )}

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

        <dialog
          className="h-screen w-screen bg-black/40 fixed inset-0 backdrop-blur-sm"
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <div className="flex items-center justify-center h-full">
            <div className="w-[400px] p-6 rounded-2xl bg-white shadow-xl relative">
              <h2 className="text-xl font-bold text-center mb-4">
                Support Our Cause
              </h2>
              <p className="text-gray-600 text-sm text-center mb-6">
                Complete your payment securely with Stripe.
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Donation Amount (USD)
                </label>
                <input
                  type="number"
                  min={1}
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(Number(e.target.value))}
                  className="input input-bordered w-full"
                />
              </div>

              <Elements stripe={stripePromise}>
                <CheckoutForm
                  amount={donationAmount}
                  onSuccess={() => {
                    setIsModalOpen(false);
                    refetch();
                  }}
                />
              </Elements>

              <button
                className="absolute top-2 right-3 text-gray-400 hover:text-gray-600"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default Funding;

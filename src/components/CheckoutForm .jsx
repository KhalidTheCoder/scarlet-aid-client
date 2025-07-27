import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/loading.json";

const CheckoutForm = ({ amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      const { data } = await axiosSecure.post("/create-payment-intent", {
        amount: amount * 100,
      });
      const { clientSecret } = data;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        await axiosSecure.post("/funding", { amount });

        onSuccess?.(result.paymentIntent);
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError("Payment failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement
        className="p-3 border rounded-lg"
        options={{
          style: { base: { fontSize: "16px", color: "#32325d" } },
        }}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="btn bg-[#F09410] hover:bg-[#BC430D] text-white px-4 py-2 rounded-md font-medium transition w-full"
      >
        {loading ? (
          <Lottie
            animationData={loadingAnimation}
            loop={true}
            style={{ width: 52, height: 52 }}
          />
        ) : (
          `Pay $${amount}`
        )}
      </button>
    </form>
  );
};

export default CheckoutForm;

import Lottie from "lottie-react";
import { useContext, useState } from "react";
import { BiEnvelope, BiKey } from "react-icons/bi";

import Title from "../components/Title";

import { Link, useLocation, useNavigate } from "react-router";
import loginAnimation from "../assets/loginAnimation.json";

import { AuthContext } from "../providers/AuthContext";

const Login = () => {
  const { signInUser } = useContext(AuthContext);
  const location = useLocation();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  console.log(location);
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const form = e.target;
    const email = form.email.value;
    const pass = form.pass.value;

    signInUser(email, pass)
      .then(() => {
        navigate(`${location.state ? location.state : "/"}`);
      })
      .catch((err) => {
        setError(err.message || "Failed to login. Please try again.");
      });
  };
  return (
    <div className="bg-[#FFF4E6]">
      <div className="pt-8 flex justify-center">
        <Title>Access Your Account</Title>
      </div>
      <div className="bg-[#FFF4E6] min-h-screen flex items-center">
        <div className="max-w-6xl mx-auto py-10">
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8">
            {/* Login Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-white/80 backdrop-blur-md p-6 sm:p-8 flex flex-col gap-6 shadow-lg rounded-xl w-full md:flex-1"
            >
              <h2 className="mb-3 text-3xl font-semibold text-center text-[#F09410]">
                Login to your account
              </h2>
              {/* Email */}
              <div className="flex items-center gap-3 bg-[#FDD0C7]/30 px-3 py-2 rounded-lg">
                <BiEnvelope className="text-xl text-[#F09410]" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  required
                  className="flex-1 bg-transparent outline-none border-b-2 border-transparent focus:border-[#F09410] px-2 py-1 text-[#241705] placeholder-gray-500 text-sm sm:text-base"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3 bg-[#FDD0C7]/30 px-3 py-2 rounded-lg">
                  <BiKey className="text-xl text-[#F09410]" />
                  <input
                    type="password"
                    name="pass"
                    placeholder="Enter Password"
                    required
                    className="flex-1 bg-transparent outline-none border-b-2 border-transparent focus:border-[#F09410] px-2 py-1 text-[#241705] placeholder-gray-500 text-sm sm:text-base"
                  />
                </div>
                <p className="text-right text-xs sm:text-sm text-gray-600 hover:text-[#F09410] cursor-pointer transition">
                  Forgot password?
                </p>
              </div>

              {/* Remember Me */}
              <label className="flex items-center gap-2 text-sm text-gray-700 -mt-2">
                <input
                  type="checkbox"
                  name="remember"
                  className="checkbox checkbox-sm accent-[#F09410]"
                />
                Remember Me
              </label>
              {error && (
                <p className="text-center text-red-500 text-sm font-medium">
                  {error}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-2 py-2 sm:py-3 bg-[#F09410] hover:bg-[#BC430D] text-white text-base sm:text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition duration-300"
              >
                Login Now
              </button>

              <p className="text-center text-sm sm:text-base text-gray-700 mt-3">
                Don’t have an account?{" "}
                <Link
                  to="/registration"
                  state={location.state}
                  className="text-[#F09410] hover:underline hover:text-[#BC430D] transition"
                >
                  Register Now
                </Link>
              </p>
            </form>

            {/* Animation */}
            <div className="lottie flex-1 max-w-xs sm:max-w-sm md:max-w-md">
              <Lottie animationData={loginAnimation} loop={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

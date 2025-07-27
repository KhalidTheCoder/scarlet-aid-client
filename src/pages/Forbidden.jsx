import { FaLock } from "react-icons/fa";
import { Link } from "react-router";
import errImg from "../assets/forbidden-error.png";

const Forbidden = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-6 py-12 text-center font-inter">
      <img
        src={errImg}
        alt="Access Forbidden"
        className="w-full max-w-md h-auto mb-8"
      />

      <div className="flex items-center justify-center text-[#BC430D] mb-3">
        <FaLock className="text-2xl mr-2" />
        <h1 className="text-2xl sm:text-3xl font-bold tracking-wide">
          Access Denied
        </h1>
      </div>

      <p className="text-gray-600 text-sm sm:text-base max-w-xl mb-6">
        You do not have the necessary permissions to view this page.
        <br className="hidden sm:block" />
        Please contact an administrator if you believe this is an error.
      </p>

      <Link
        to="/"
        className="inline-block bg-[#F09410] hover:bg-[#BC430D] text-white px-6 py-3 rounded-lg text-sm sm:text-base font-medium shadow-md hover:shadow-lg transition duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default Forbidden;

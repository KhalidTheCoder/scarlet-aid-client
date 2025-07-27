import { Link, useRouteError } from "react-router";
import Header from "../components/Header";
import errImg from "../assets/Error.jpg";

const Error = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white flex flex-col justify-center items-center px-6 py-12 text-center font-inter">
        <img
          src={errImg}
          alt="Page Not Found"
          className="w-full max-w-md h-auto mb-8"
        />

        <h1 className="text-3xl sm:text-4xl font-bold text-[#BC430D] mb-3">
          Oops! Something Went Wrong.
        </h1>

        {error?.statusText || error?.message ? (
          <p className="text-gray-600 font-medium text-sm sm:text-base max-w-lg mb-6">
            {error.statusText || error.message}
          </p>
        ) : (
          <p className="text-gray-600 font-medium text-sm sm:text-base max-w-lg mb-6">
            The page you are looking for might have been removed or is
            temporarily unavailable.
          </p>
        )}

        <Link
          to="/"
          className="inline-block bg-[#F09410] hover:bg-[#BC430D] text-white px-6 py-3 rounded-lg text-sm sm:text-base font-medium shadow-md hover:shadow-lg transition duration-300"
        >
          Go Back Home
        </Link>
      </div>
    </>
  );
};

export default Error;

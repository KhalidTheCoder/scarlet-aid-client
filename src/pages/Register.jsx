import Lottie from "lottie-react";
import { useContext, useState } from "react";
import {
  BiEnvelope,
  BiImageAdd,
  BiKey,
  BiUser,
  BiDroplet,
  BiMap,
  BiMapAlt,
} from "react-icons/bi";
import { Link, useLocation, useNavigate } from "react-router";
import happy from "../assets/Register.json";
import Title from "../components/Title";
import { AuthContext } from "../providers/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../hooks/useAxios";

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

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { createUser, setUser, updateUser } = useContext(AuthContext);
  const axiosPublic = useAxios();

  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.pass.value;
    const confirmPass = form.confirmPass.value;
    const bloodGroup = form.bloodGroup.value;
    const district = form.district.value;
    const upazila = form.upazila.value;
    const imageFile = form.image.files[0];

    if (password !== confirmPass) {
      Swal.fire({
        icon: "warning",
        title: "Password Mismatch",
        text: "Please make sure both password fields match before continuing.",
      });
      setLoading(false);
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      Swal.fire(
        "Weak Password!",
        "Password must be at least 6 characters long, contain at least one uppercase letter and one number.",
        "error"
      );
      setLoading(false);
      return;
    }

    if (!imageFile) {
      Swal.fire("Error!", "Please upload an avatar image", "error");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const imgRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
        formData
      );

      const avatarUrl = imgRes.data.data.display_url;

      const res = await createUser(email, password);

      await updateUser({ displayName: name, photoURL: avatarUrl });

      setUser({ ...res.user, displayName: name, photoURL: avatarUrl });

      await axiosPublic.post(`/users`, {
        name,
        email,
        avatar: avatarUrl,
        bloodGroup,
        district,
        upazila,
        role: "donor",
        status: "active",
      });

      Swal.fire("Success!", "Registration successful", "success");
      navigate(`${location.state ? location.state : "/"}`);
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error!",
        error.response?.data?.message || error.message,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FFF4E6]">
      <div className="bg-[#FFF4E6] min-h-screen">
        <div className="max-w-5xl mx-auto py-8 md:py-12">
          <div className="mb-5 flex justify-center">
            <Title>Join with Us!</Title>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 pt-8 md:pt-12">
            {/* Registration Form */}

            <form
              onSubmit={handleSubmit}
              className="bg-white/80 backdrop-blur-md p-6 sm:p-8 flex flex-col gap-5 shadow-lg rounded-xl w-full md:flex-1"
            >
              <h2 className="mb-3 text-3xl font-semibold text-center text-[#F09410]">
                Register your account
              </h2>
              {[
                {
                  icon: BiUser,
                  type: "text",
                  name: "name",
                  placeholder: "Full Name",
                },
                {
                  icon: BiImageAdd,
                  type: "file",
                  name: "image",
                  accept: "image/*",
                },
                {
                  icon: BiEnvelope,
                  type: "email",
                  name: "email",
                  placeholder: "Email Address",
                },
              ].map(({ icon: Icon, ...rest }, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-[#FDD0C7]/30 px-3 py-2 rounded-lg"
                >
                  <Icon className="text-xl text-[#F09410]" />
                  <input
                    {...rest}
                    required
                    className="flex-1 bg-transparent outline-none border-b-2 border-transparent focus:border-[#F09410] px-2 py-1 text-[#241705] placeholder-gray-500 text-sm sm:text-base"
                  />
                </div>
              ))}

              <div className="flex items-center gap-3 bg-[#FDD0C7]/30 px-3 py-2 rounded-lg">
                <BiDroplet className="text-xl text-[#F09410]" />
                <select
                  name="bloodGroup"
                  required
                  className="flex-1 bg-transparent outline-none border-b-2 border-transparent focus:border-[#F09410] px-2 py-1 text-[#241705] text-sm sm:text-base"
                >
                  <option value="">Select Blood Group</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="flex items-center gap-3 bg-[#FDD0C7]/30 px-3 py-2 rounded-lg">
                <BiMap className="text-xl text-[#F09410]" />
                <select
                  name="district"
                  required
                  onChange={(e) =>
                    setSelectedDistrictId(
                      districts.find((d) => d.name === e.target.value)?.id || ""
                    )
                  }
                  className="flex-1 bg-transparent outline-none border-b-2 border-transparent focus:border-[#F09410] px-2 py-1 text-[#241705] text-sm sm:text-base"
                >
                  <option value="">Select District</option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 bg-[#FDD0C7]/30 px-3 py-2 rounded-lg">
                <BiMapAlt className="text-xl text-[#F09410]" />
                <select
                  name="upazila"
                  required
                  className="flex-1 bg-transparent outline-none border-b-2 border-transparent focus:border-[#F09410] px-2 py-1 text-[#241705] text-sm sm:text-base"
                >
                  <option value="">Select Upazila</option>
                  {upazilas.map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              {[
                {
                  icon: BiKey,
                  type: "password",
                  name: "pass",
                  placeholder: "Password",
                },
                {
                  icon: BiKey,
                  type: "password",
                  name: "confirmPass",
                  placeholder: "Confirm Password",
                },
              ].map(({ icon: Icon, ...rest }, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-[#FDD0C7]/30 px-3 py-2 rounded-lg"
                >
                  <Icon className="text-xl text-[#F09410]" />
                  <input
                    {...rest}
                    required
                    className="flex-1 bg-transparent outline-none border-b-2 border-transparent focus:border-[#F09410] px-2 py-1 text-[#241705] placeholder-gray-500 text-sm sm:text-base"
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 py-2 sm:py-3 bg-[#F09410] hover:bg-[#BC430D] text-white text-base sm:text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition duration-300 disabled:opacity-50"
              >
                {loading ? "Registering..." : "Register Now"}
              </button>

              <p className="text-center text-sm sm:text-base text-gray-700 mt-3">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#F09410] hover:underline hover:text-[#BC430D] transition"
                >
                  Login Now
                </Link>
              </p>
            </form>

            <div className="lottie flex-1 flex max-w-xs sm:max-w-sm md:max-w-md">
              <Lottie animationData={happy} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

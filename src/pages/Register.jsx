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
import { useNavigate } from "react-router";
import happy from "../assets/happy.json";
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
      Swal.fire("Error!", "Passwords do not match", "error");
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
      navigate("/");
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
    <div className="bg-[#EAEBD0] bg-contain">
      <div className="bg-[#EAEBD0] bg-opacity-90 min-h-screen">
        <div className="w-11/12 mx-auto py-10">
          <Title>Join with Us</Title>

          <div className="flex justify-between items-center gap-5 pt-8 flex-col md:flex-row">
            <form
              onSubmit={handleSubmit}
              className="bg-white p-5 flex flex-col gap-6 backdrop-blur-sm bg-opacity-10 shadow-lg rounded-lg flex-1"
            >
              <div className="flex items-center gap-2">
                <BiUser className="text-3xl text-slate-500" />
                <input
                  className="outline-none flex-1 border-b-2 p-2 bg-transparent focus:border-[#AF3E3E]"
                  type="text"
                  name="name"
                  placeholder="Enter Full Name"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <BiImageAdd className="text-3xl text-slate-500" />
                <input
                  className="flex-1"
                  type="file"
                  name="image"
                  accept="image/*"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <BiEnvelope className="text-3xl text-slate-500" />
                <input
                  className="outline-none flex-1 border-b-2 p-2 bg-transparent focus:border-[#AF3E3E]"
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <BiDroplet className="text-3xl text-slate-500" />
                <select
                  name="bloodGroup"
                  className="outline-none flex-1 border-b-2 p-2 bg-transparent focus:border-[#AF3E3E]"
                  required
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

              <div className="flex items-center gap-2">
                <BiMap className="text-3xl text-slate-500" />
                <select
                  name="district"
                  className="outline-none flex-1 border-b-2 p-2 bg-transparent focus:border-[#AF3E3E]"
                  required
                  onChange={(e) =>
                    setSelectedDistrictId(
                      districts.find((d) => d.name === e.target.value)?.id || ""
                    )
                  }
                >
                  <option value="">Select District</option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <BiMapAlt className="text-3xl text-slate-500" />
                <select
                  name="upazila"
                  className="outline-none flex-1 border-b-2 p-2 bg-transparent focus:border-[#AF3E3E]"
                  required
                >
                  <option value="">Select Upazila</option>
                  {upazilas.map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <BiKey className="text-3xl text-slate-500" />
                <input
                  className="outline-none flex-1 border-b-2 p-2 bg-transparent focus:border-[#AF3E3E]"
                  type="password"
                  name="pass"
                  placeholder="Enter Password"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <BiKey className="text-3xl text-slate-500" />
                <input
                  className="outline-none flex-1 border-b-2 p-2 bg-transparent focus:border-[#AF3E3E]"
                  type="password"
                  name="confirmPass"
                  placeholder="Confirm Password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn cursor-pointer bg-[#CD5656] text-white"
              >
                {loading ? "Registering..." : "Register Now"}
              </button>
            </form>

            <div className="lottie flex-1 flex mx-20">
              <Lottie animationData={happy} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

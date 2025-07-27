import React, { useState, useEffect, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { BiImageAdd } from "react-icons/bi";
import Swal from "sweetalert2";
import { AuthContext } from "../providers/AuthContext";
import Title from "../components/Title";
import Loading from "../pages/Loading";

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

const Profile = () => {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/users/profile");
      return data;
    },
  });

  const { data: districts = [] } = useQuery({
    queryKey: ["districts"],
    queryFn: fetchDistricts,
  });
  const { data: allUpazilas = [] } = useQuery({
    queryKey: ["upazilas"],
    queryFn: fetchUpazilas,
  });

  const [isEditing, setIsEditing] = useState(false);
  const { updateUser } = useContext(AuthContext);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (user) {
      setSelectedDistrict(user.district || "");
      setSelectedUpazila(user.upazila || "");
      setAvatarUrl(user.avatar || "");
    }
  }, [user]);

  const filteredUpazilas = allUpazilas.filter(
    (u) =>
      String(u.district_id) ===
      (districts.find((d) => d.name === selectedDistrict)?.id ?? "")
  );

  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData) => {
      const { data } = await axiosSecure.put("/users/profile", updatedData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
      setIsEditing(false);
      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile has been updated successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
    },
  });

  if (isLoading)
    return <Loading></Loading>;
  if (isError)
    return (
      <div className="text-center text-red-500">Failed to load profile.</div>
    );

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (data.success) {
        setAvatarUrl(data.data.url);
      } else {
        alert("Image upload failed. Please try again.");
      }
    } catch (error) {
      alert("Error uploading image: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = {
      name: e.target.name.value,
      avatar: avatarUrl,
      district: e.target.district.value,
      upazila: e.target.upazila.value,
      bloodGroup: e.target.bloodGroup.value,
    };

    try {
      await updateUser({
        displayName: updatedData.name,
        photoURL: updatedData.avatar,
      });

      updateProfileMutation.mutate(updatedData);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message,
      });
    }
  };

  return (
    <div>
      <div className="mt-5 mb-15 flex justify-center">
        <Title>Account Details & Info</Title>
      </div>
      <div className="max-w-3xl mx-auto font-medium bg-white shadow-lg rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#241705]">My Profile</h2>
          <button
            onClick={async () => {
              if (isEditing) {
                const { data: freshUser } = await refetch();
                setSelectedDistrict(freshUser.district || "");
                setSelectedUpazila(freshUser.upazila || "");
                setAvatarUrl(freshUser.avatar || "");
              }
              setIsEditing(!isEditing);
            }}
            className="bg-[#F09410] hover:bg-[#BC430D] text-white px-4 py-2 rounded-md text-sm font-medium transition"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center gap-4">
            <img
              src={avatarUrl || user.avatar}
              alt="avatar"
              className="w-24 h-24 rounded-full border border-[#F09410] object-cover"
            />
            {isEditing && (
              <label className="cursor-pointer flex flex-col items-center">
                <BiImageAdd className="text-3xl text-[#F09410]" />
                <span className="text-xs text-[#241705]">Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="text-sm font-semibold text-[#241705]">
                Name
              </label>
              <input
                type="text"
                name="name"
                defaultValue={user.name}
                disabled={!isEditing}
                className={`w-full mt-1 p-2 text-sm border-b-2 transition-all focus:outline-none ${
                  isEditing
                    ? "bg-white border-[#F09410]"
                    : "bg-[#FFF4E6] border-transparent"
                }`}
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-[#241705]">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full mt-1 p-2 text-sm bg-[#FFF4E6] border-b-2 border-transparent"
              />
            </div>

            {/* District */}
            <div>
              <label className="text-sm font-semibold text-[#241705]">
                District
              </label>
              {isEditing ? (
                <select
                  name="district"
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  required
                  className="w-full mt-1 p-2 text-sm border-b-2 bg-white focus:outline-none focus:border-[#F09410]"
                >
                  <option value="">Select District</option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={user.district}
                  disabled
                  className="w-full mt-1 p-2 text-sm bg-[#FFF4E6] border-b-2 border-transparent"
                />
              )}
            </div>

            {/* Upazila */}
            <div>
              <label className="text-sm font-semibold text-[#241705]">
                Upazila
              </label>
              {isEditing ? (
                <select
                  name="upazila"
                  value={selectedUpazila}
                  onChange={(e) => setSelectedUpazila(e.target.value)}
                  required
                  className="w-full mt-1 p-2 text-sm border-b-2 bg-white focus:outline-none focus:border-[#F09410]"
                >
                  <option value="">Select Upazila</option>
                  {filteredUpazilas.map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={user.upazila}
                  disabled
                  className="w-full mt-1 p-2 text-sm bg-[#FFF4E6] border-b-2 border-transparent"
                />
              )}
            </div>

            {/* Blood Group */}
            <div>
              <label className="text-sm font-semibold text-[#241705]">
                Blood Group
              </label>
              {isEditing ? (
                <select
                  name="bloodGroup"
                  defaultValue={user.bloodGroup}
                  required
                  className="w-full mt-1 p-2 text-sm border-b-2 bg-white focus:outline-none focus:border-[#F09410]"
                >
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    )
                  )}
                </select>
              ) : (
                <input
                  type="text"
                  value={user.bloodGroup}
                  disabled
                  className="w-full mt-1 p-2 text-sm bg-[#FFF4E6] border-b-2 border-transparent"
                />
              )}
            </div>
          </div>

          {isEditing && (
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-[#F09410] hover:bg-[#BC430D] text-white py-2 rounded-md font-medium transition"
              >
                Save Profile
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;

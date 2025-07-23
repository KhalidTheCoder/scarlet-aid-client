import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { BiImageAdd } from "react-icons/bi";
import Swal from "sweetalert2";

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
    return <div className="text-center p-4">Loading profile...</div>;
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
      name: e.target.name.value,
      avatar: avatarUrl,
      district: e.target.district.value,
      upazila: e.target.upazila.value,
      bloodGroup: e.target.bloodGroup.value,
    };
    updateProfileMutation.mutate(updatedData);
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow p-6 my-30">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#AF3E3E]">My Profile</h2>
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
          className="bg-[#DA6C6C] hover:bg-[#CD5656] font-medium text-white px-4 py-1 rounded transition"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-center gap-2">
          <img
            src={avatarUrl || user.avatar}
            alt="avatar"
            className="w-24 h-24 rounded-full border object-cover"
          />
          {isEditing && (
            <label className="mt-3 flex flex-col items-center cursor-pointer">
              <BiImageAdd className="text-3xl text-slate-500 mb-1" />
              <span className="text-sm font-medium text-gray-500">
                Choose Photo
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Name
          </label>
          <input
            type="text"
            name="name"
            defaultValue={user.name}
            disabled={!isEditing}
            className={`w-full p-2 outline-none border-0 text-black border-b-2 transition-all duration-200 focus:border-b-2 focus:border-[#AF3E3E] ${
              isEditing ? "bg-white" : "bg-gray-100"
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="email"
            value={user.email}
            disabled
            className="border-b-2 w-full p-2 bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            District
          </label>
          {isEditing ? (
            <select
              name="district"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              required
              className="w-full p-2 outline-none border-0 border-b-2 bg-white transition-all duration-200 focus:border-[#AF3E3E]"
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
              className="w-full p-2 outline-none border-0 border-b-2 bg-gray-100"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Upazila
          </label>
          {isEditing ? (
            <select
              name="upazila"
              value={selectedUpazila}
              onChange={(e) => setSelectedUpazila(e.target.value)}
              required
              className="w-full p-2 outline-none border-0 border-b-2 bg-white transition-all duration-200 focus:border-[#AF3E3E]"
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
              className="w-full p-2 outline-none border-0 border-b-2 bg-gray-100"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Blood Group
          </label>
          {isEditing ? (
            <select
              name="bloodGroup"
              defaultValue={user.bloodGroup}
              required
              className="w-full p-2 outline-none border-0 border-b-2 bg-white transition-all duration-200 focus:border-[#AF3E3E]"
            >
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={user.bloodGroup}
              disabled
              className="w-full p-2 outline-none border-0 border-b-2 bg-gray-100"
            />
          )}
        </div>

        {isEditing && (
          <button
            type="submit"
            className="w-full bg-[#AF3E3E] hover:bg-[#CD5656] font-medium text-white py-2 rounded"
          >
            Save
          </button>
        )}
      </form>
    </div>
  );
};

export default Profile;

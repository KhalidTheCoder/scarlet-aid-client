import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Loading from "../pages/Loading";
import useAxios from "../hooks/useAxios";
import { BiDroplet, BiMap, BiMapAlt } from "react-icons/bi";

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

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const SearchDonors = () => {
  const axiosPublic = useAxios();

  const { data: districts = [], isLoading: districtsLoading } = useQuery({
    queryKey: ["districts"],
    queryFn: fetchDistricts,
  });

  const { data: allUpazilas = [], isLoading: upazilasLoading } = useQuery({
    queryKey: ["upazilas"],
    queryFn: fetchUpazilas,
  });

  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [filters, setFilters] = useState({
    bloodGroup: "",
    district: "",
    upazila: "",
  });
  const [searchTriggered, setSearchTriggered] = useState(false);

  const upazilas = allUpazilas.filter(
    (u) => String(u.district_id) === String(selectedDistrictId)
  );

  const {
    data: donors = [],
    isLoading: donorsLoading,
    isError,
  } = useQuery({
    queryKey: ["donorsSearch", filters],
    queryFn: async () => {
      const res = await axiosPublic.get("/donors/search", {
        params: {
          bloodGroup: filters.bloodGroup,
          district: filters.district,
          upazila: filters.upazila,
        },
      });
      return res.data;
    },
    enabled: searchTriggered,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "district" ? { upazila: "" } : {}),
    }));

    if (name === "district") {
      const selectedDistrict = districts.find((d) => d.name === value);
      setSelectedDistrictId(selectedDistrict ? selectedDistrict.id : "");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!filters.bloodGroup) return;
    setSearchTriggered(true);
  };

  if (districtsLoading || upazilasLoading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-6">Search Donors</h1>

      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
      >
        <div className="flex items-center gap-2 border-b-2 border-gray-300 focus-within:border-primary transition-colors">
          <BiDroplet className="text-3xl text-slate-500" />
          <select
            name="bloodGroup"
            className="outline-none flex-1 p-2 bg-transparent"
            value={filters.bloodGroup}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Blood Group</option>
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 border-b-2 border-gray-300 focus-within:border-primary transition-colors">
          <BiMap className="text-3xl text-slate-500" />
          <select
            name="district"
            className="outline-none flex-1 p-2 bg-transparent"
            value={filters.district}
            onChange={handleInputChange}
          >
            <option value="">Select District</option>
            {districts.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 border-b-2 border-gray-300 focus-within:border-primary transition-colors">
          <BiMapAlt className="text-3xl text-slate-500" />
          <select
            name="upazila"
            className="outline-none flex-1 p-2 bg-transparent"
            value={filters.upazila}
            onChange={handleInputChange}
            disabled={!filters.district}
          >
            <option value="">Select Upazila</option>
            {upazilas.map((u) => (
              <option key={u.id} value={u.name}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-primary col-span-1 sm:col-span-3"
        >
          Search
        </button>
      </form>

      {donorsLoading && <Loading />}
      {isError && (
        <p className="text-center text-red-500">Failed to fetch donors.</p>
      )}

      {searchTriggered && donors.length === 0 && !donorsLoading && (
        <p className="text-center text-gray-500">No donors found.</p>
      )}

      {donors.length > 0 && (
        <>
          {/* Table for md and larger screens */}
          <div className="overflow-x-auto mt-8 hidden md:block">
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th>Name & Email</th>
                  <th>Location</th>
                  <th>Blood Group</th>
                </tr>
              </thead>
              <tbody>
                {donors.map((donor, index) => (
                  <tr key={donor._id}>
                    <th>{index + 1}</th>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img src={donor.avatar} alt={donor.name} />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{donor.name}</div>
                          <div className="text-sm opacity-50">
                            {donor.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {donor.district}
                      <br />
                      <span className="badge badge-ghost badge-sm">
                        {donor.upazila}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-accent">
                        {donor.bloodGroup}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards for small screens */}
          <div className="mt-8 space-y-4 md:hidden">
            {donors.map((donor) => (
              <div
                key={donor._id}
                className="card bg-base-100 shadow p-4 space-y-2"
              >
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                      <img src={donor.avatar} alt={donor.name} />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-lg">{donor.name}</div>
                    <div className="text-sm opacity-50">{donor.email}</div>
                  </div>
                </div>
                <p>
                  <strong>Location:</strong> {donor.district}, {donor.upazila}
                </p>
                <p>
                  <strong>Blood Group:</strong>{" "}
                  <span className="badge badge-accent">{donor.bloodGroup}</span>
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchDonors;

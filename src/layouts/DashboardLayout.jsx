import React, { useState, useContext } from "react";
import { NavLink, Outlet } from "react-router";
import { AuthContext } from "../providers/AuthContext";
import { FiMenu, FiX } from "react-icons/fi";
import useUserRole from "../hooks/useUserRole";

const DashboardLayout = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const { role, roleLoading } = useUserRole();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex min-h-screen bg-[#EAEBD0]">
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-40 md:hidden ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      />

      <div
        className={`fixed md:static top-0 left-0 min-h-screen w-64 bg-[#AF3E3E] text-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-200 flex flex-col z-50`}
      >
        <div className="p-5 font-bold text-xl border-b border-[#CD5656]">
          Scarlet Aid
        </div>
        <nav className="flex flex-col p-4 space-y-2">
          {/* Always visible links */}
          <NavLink
            to="/dashboard"
            end
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `p-2 rounded hover:bg-[#CD5656] ${isActive ? "bg-[#DA6C6C]" : ""}`
            }
          >
            <span className="font-medium">Home</span>
          </NavLink>
          <NavLink
            to="/dashboard/profile"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `p-2 rounded hover:bg-[#CD5656] ${isActive ? "bg-[#DA6C6C]" : ""}`
            }
          >
            <span className="font-medium">My Profile</span>
          </NavLink>

          {/* Wait for role to load */}
          {!roleLoading && role === "donor" && (
            <>
              <NavLink
                to="/dashboard/my-donation-requests"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `p-2 rounded hover:bg-[#CD5656] ${
                    isActive ? "bg-[#DA6C6C]" : ""
                  }`
                }
              >
                <span className="font-medium">My Donation Requests</span>
              </NavLink>
              <NavLink
                to="/dashboard/create-donation-requests"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `p-2 rounded hover:bg-[#CD5656] ${
                    isActive ? "bg-[#DA6C6C]" : ""
                  }`
                }
              >
                <span className="font-medium">Create Donation Requests</span>
              </NavLink>
              {/* Add more donor-specific links here if needed */}
            </>
          )}

          {!roleLoading && role === "volunteer" && (
            <>
              <NavLink
                to="/dashboard/volunteer-assignments"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `p-2 rounded hover:bg-[#CD5656] ${
                    isActive ? "bg-[#DA6C6C]" : ""
                  }`
                }
              >
                <span className="font-medium">Volunteer Assignments</span>
              </NavLink>
              {/* Add more volunteer-specific links here */}
            </>
          )}

          {!roleLoading && role === "admin" && (
            <>
              <NavLink
                to="/dashboard/manage-users"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `p-2 rounded hover:bg-[#CD5656] ${
                    isActive ? "bg-[#DA6C6C]" : ""
                  }`
                }
              >
                <span className="font-medium">Manage Users</span>
              </NavLink>
              <NavLink
                to="/dashboard/manage-donations"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `p-2 rounded hover:bg-[#CD5656] ${
                    isActive ? "bg-[#DA6C6C]" : ""
                  }`
                }
              >
                <span className="font-medium">Manage Donations</span>
              </NavLink>
              {/* Add more admin-specific links here */}
            </>
          )}
        </nav>
        <div className="p-4 mt-auto">
          <button
            onClick={() => {
              logOut();
              setIsOpen(false);
            }}
            className="w-full bg-[#DA6C6C] hover:bg-[#CD5656] text-white font-medium p-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-screen">
        <div className="flex items-center justify-between bg-white p-4 shadow md:hidden">
          <button onClick={toggleSidebar}>
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <div className="font-bold">{user?.displayName || "Dashboard"}</div>
          <img
            src={user?.photoURL}
            alt="avatar"
            className="w-10 h-10 rounded-full border"
          />
        </div>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

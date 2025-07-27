import { useContext, useState, useRef, useEffect } from "react";
import { CgMenuMotion } from "react-icons/cg";
import { RiMenuAddLine } from "react-icons/ri";
import { Link, NavLink } from "react-router";
import { AuthContext } from "../providers/AuthContext";
import logoImg from "../assets/logo.JPG";

const Header = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const avatarRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setIsAvatarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuLinks = [
    { name: "Home", path: "/" },
    { name: "Donation Requests", path: "/donationRequest" },
    { name: "Blog", path: "/blogs" },
    { name: "Search Donor", path: "/searchDonor" },
  ];

  const linkClasses =
    "px-3 py-2 text-sm font-medium rounded hover:bg-white/20 transition-colors duration-200 tracking-wide";

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#BC430d] to-[#241705] text-white shadow-md font-inter">
      <div className="max-w-7xl mx-auto py-4 flex justify-between items-center">
        {/* Logo */}

        <Link to="/" className="flex justify-center items-center gap-2">
          <img className="w-12 rounded-3xl" src={logoImg} alt="" />
          <h1 className="text-xl font-bold tracking-wide hover:scale-105 transition-transform duration-200">
            ScarletAid
          </h1>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center gap-5">
          {menuLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `${linkClasses} ${isActive ? "bg-white/20" : ""}`
              }
            >
              {item.name}
            </NavLink>
          ))}

          {user && user?.email ? (
            <>
              <NavLink
                to="/fund"
                className={({ isActive }) =>
                  `${linkClasses} ${isActive ? "bg-white/20" : ""}`
                }
              >
                Funding
              </NavLink>

              {/* Avatar with dropdown */}
              <div className="relative" ref={avatarRef}>
                <img
                  src={user.photoURL || "/default-avatar.png"}
                  alt="User Avatar"
                  onClick={() => setIsAvatarOpen((prev) => !prev)}
                  className="w-9 h-9 rounded-full cursor-pointer ring-2 ring-white/40 hover:ring-orange-400 transition duration-200"
                />
                <div
                  className={`absolute right-0 mt-3 w-40 bg-white text-gray-800 rounded-md shadow-lg py-2 transform transition-all duration-200 origin-top-right ${
                    isAvatarOpen
                      ? "scale-100 opacity-100"
                      : "scale-95 opacity-0 pointer-events-none"
                  }`}
                >
                  <NavLink
                    to="/dashboard"
                    onClick={() => setIsAvatarOpen(false)}
                    className="block px-4 py-2 font-medium hover:bg-gray-100 text-sm"
                  >
                    Dashboard
                  </NavLink>
                  <button
                    onClick={() => {
                      logOut();
                      setIsAvatarOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 font-medium hover:bg-gray-100 text-sm"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `${linkClasses} ${isActive ? "bg-white/20" : ""}`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/registration"
                className={({ isActive }) =>
                  `${linkClasses} ${isActive ? "bg-white/20" : ""}`
                }
              >
                Register
              </NavLink>
            </>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          {!isMenuOpen ? (
            <RiMenuAddLine
              onClick={() => setIsMenuOpen(true)}
              className="text-2xl cursor-pointer"
            />
          ) : (
            <CgMenuMotion
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl cursor-pointer"
            />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <ul
        className={`lg:hidden flex flex-col gap-3 absolute bg-[#1c0f05] text-white font-medium w-full px-6 py-5 transition-all duration-300 text-sm ${
          isMenuOpen ? "top-16 opacity-100" : "-top-96 opacity-0"
        }`}
      >
        {menuLinks.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsMenuOpen(false)}
            className="py-2 border-b border-white/20 hover:text-orange-400"
          >
            {item.name}
          </NavLink>
        ))}

        {user && user?.email ? (
          <>
            <NavLink
              to="/fund"
              onClick={() => setIsMenuOpen(false)}
              className="py-2 border-b border-white/20 hover:text-orange-400"
            >
              Funding
            </NavLink>
            <NavLink
              to="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className="py-2 border-b border-white/20 hover:text-orange-400"
            >
              Dashboard
            </NavLink>
            <button
              onClick={() => {
                logOut();
                setIsMenuOpen(false);
              }}
              className="py-2 hover:text-orange-400"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="py-2 border-b border-white/20 hover:text-orange-400"
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              onClick={() => setIsMenuOpen(false)}
              className="py-2 hover:text-orange-400"
            >
              Register
            </NavLink>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Header;

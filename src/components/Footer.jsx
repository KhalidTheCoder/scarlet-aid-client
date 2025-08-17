import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";
import { Link, NavLink } from "react-router";
import logoImg from "../assets/logo.JPG";

const Footer = () => {
  return (
    <footer className="bg-[#BC430D] text-white font-inter pt-16 pb-10 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            <img className="w-12 rounded-3xl" src={logoImg} alt="" />
            <h1 className="text-xl font-bold tracking-wide hover:scale-105 transition-transform duration-200">
              ScarletAid
            </h1>
          </Link>
          <p className="text-sm leading-relaxed text-white/90 font-medium">
            ScarletAid is a trusted platform that connects compassionate donors
            with individuals in urgent need, empowering communities through the
            gift of life.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-5">Quick Links</h3>
          <ul className="space-y-3 text-sm font-medium text-white/90">
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/donationRequest">Donation Request</NavLink>
            </li>
            <li>
              <NavLink to="/searchDonor">Search Donor</NavLink>
            </li>
            <li>
              <NavLink to="/blogs">Blog</NavLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-5">Get in Touch</h3>
          <ul className="space-y-4 text-sm text-white/85 font-medium">
            <li className="flex items-start gap-3">
              <FaEnvelope className="text-[#FDD0C7] mt-1" />
              <span>support@scarletaid.org</span>
            </li>
            <li className="flex items-start gap-3">
              <FaPhoneAlt className="text-[#FDD0C7] mt-1" />
              <span>+880 1234-567890</span>
            </li>
            <li className="pl-1">Dhaka, Bangladesh</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-5">Connect With Us</h3>
          <p className="text-sm font-medium text-white/85 mb-4">
            Follow us on social platforms to stay updated and spread the word.
          </p>
          <div className="flex gap-4 text-lg text-white/90">
            <a
              href="#"
              aria-label="Facebook"
              className="hover:text-[#FDD0C7] transition duration-200"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="hover:text-[#FDD0C7] transition duration-200"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-[#FDD0C7] transition duration-200"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="hover:text-[#FDD0C7] transition duration-200"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-14 border-t border-white/20 pt-6 text-center text-sm text-white/70">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-white">ScarletAid</span>. All rights
        reserved.
      </div>
    </footer>
  );
};

export default Footer;

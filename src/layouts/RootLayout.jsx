import { Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const RootLayout = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out",
      once: false,
      mirror: false,
    });
  }, []);
  return (
    <div className="bg-gray-50">
      <Header></Header>
      <main className="overflow-x-clip">
        <Outlet></Outlet>
        <Footer></Footer>
      </main>
    </div>
  );
};

export default RootLayout;

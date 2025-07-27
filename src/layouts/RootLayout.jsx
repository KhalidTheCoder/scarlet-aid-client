import { Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";

const RootLayout = () => {
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

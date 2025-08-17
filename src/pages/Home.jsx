import Banner from "../components/Banner";
import ContactUs from "../components/ContactUs";
import Featured from "../components/Featured";
import RecentDonationsReq from "../components/RecentDonationsReq";
import ScarletAidMission from "../components/ScarletAidMission";
import Sponsors from "../components/Sponsors";
import StatsSection from "../components/StatsSection";
import SuccessStories from "../components/SuccessStories";

const Home = () => {
  return (
    <>
      <Banner />
      <ScarletAidMission />
      <Sponsors />
      <StatsSection />
      <RecentDonationsReq />
      <Featured />
      <SuccessStories />
      <ContactUs />
    </>
  );
};

export default Home;

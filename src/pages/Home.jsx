import Banner from "../components/Banner";
import ContactUs from "../components/ContactUs";
import Featured from "../components/Featured";
import RecentDonationsReq from "../components/RecentDonationsReq";
import ScarletAidMission from "../components/ScarletAidMission";
import StatsSection from "../components/StatsSection";
import SuccessStories from "../components/SuccessStories";




const Home = () => {
  return (
    <>
      <Banner></Banner>
      <RecentDonationsReq></RecentDonationsReq>
      <ScarletAidMission></ScarletAidMission>
      <Featured></Featured>
      <SuccessStories></SuccessStories>
      <StatsSection></StatsSection>
      <ContactUs></ContactUs>
    </>
  );
};

export default Home;

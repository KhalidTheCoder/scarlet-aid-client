import Banner from "../components/Banner";
import ContactUs from "../components/ContactUs";
import Featured from "../components/Featured";
import RecentDonationsReq from "../components/RecentDonationsReq";
import StatsSection from "../components/StatsSection";




const Home = () => {
  return (
    <>
      <Banner></Banner>
      <RecentDonationsReq></RecentDonationsReq>
      <Featured></Featured>
      <StatsSection></StatsSection>
      <ContactUs></ContactUs>
    </>
  );
};

export default Home;

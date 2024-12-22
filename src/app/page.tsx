
import Arrivals from "./Components/Arrivals/Arrivals";
import Categories from "./Components/Categories/Categories";
import FeaturedSection from "./Components/FeaturedSection/FeaturedSection";
import Footer from "./Components/Footer";
import IconSection from "./Components/IconSection/page";
import Navbar from "./Components/Navbar";
import Newsletter from "./Components/Newsletter/Newsletter";

export default function Home() {
  return (
    <>
      <Navbar />
      <Categories />
      <IconSection />
      <FeaturedSection />
      <Newsletter />
      <Arrivals />
      <Footer />
    </>
  );
}

import AboutUs from "./components/aboutus";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const dynamic = "force-static"; // optional: or remove if you prefer default

export default function AboutUsPage() {

  return (
    <>
      <Navbar scheme="white" />
      <div className="bg-white">
        <AboutUs />
        <Footer />
      </div>
    </>
  );
}


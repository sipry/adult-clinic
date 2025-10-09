// app/galeria/page.tsx
import Gallery from "./components/Gallery";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const dynamic = "force-static"; // opcional

export default function GalleryPage() {
  return (
    <>
      <Navbar scheme="white" />
      <Gallery />
      <Footer />
    </>
  );
}

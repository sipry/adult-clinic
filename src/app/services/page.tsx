"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import AllServices from "@/app/services/components/AllServices";
import Footer from "../components/Footer";

export default function ServicesPage() {
  const router = useRouter();
  return (
    <>
      <Navbar scheme="white" />
      <div className="bg-white">
      <AllServices />
      <Footer />
      </div>
    </>
  );
}

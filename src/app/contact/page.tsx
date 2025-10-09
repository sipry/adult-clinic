"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Contact from "@/app/components/Contact";
import Footer from "../components/Footer";

export default function ServicesPage() {
    const router = useRouter();
    return (
        <>
            <Navbar scheme="white" />
            <div className="mt-15">
                <Contact />
                <Footer/>
            </div>
        </>
    );
}

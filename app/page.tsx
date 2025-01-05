"use client";
import dynamic from "next/dynamic";
//import LandingPage from "@/components/Landing/LandingPage";
const LandingPage = dynamic(() => import("@/components/Landing/LandingPage"), {
  ssr: false,
});

export default function Home() {
  return (
    <div>
      <LandingPage />
    </div>
  );
}

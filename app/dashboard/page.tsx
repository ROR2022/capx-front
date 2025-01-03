"use client";
import React from "react";

import dynamic from "next/dynamic";

//import Dashboard from "@/components/Dashboard/Dashboard";
const Dashboard = dynamic(() => import("@/components/Dashboard/Dashboard"), {
  ssr: false,
});

const page = () => {
  return (
    <div>
      <Dashboard />
    </div>
  );
};

export default page;

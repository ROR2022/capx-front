//import React from 'react'
//import Stocks from "@/components/Stocks/Stocks";
"use client";
import dynamic from "next/dynamic";
const Stocks = dynamic(() => import("@/components/Stocks/Stocks"), {
  ssr: false,
});

const page = () => {
  return (
    <div>
      <Stocks />
    </div>
  );
};

export default page;

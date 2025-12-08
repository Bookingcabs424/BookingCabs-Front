"use client";
import React from "react";
import Dashboard from "../../components/Dashboard";
import Chatbot from "../../components/Chatbot";

const DashBoard = () => {
  return (
    <div className="min-h-screen w-full">
      <Dashboard />
      <Chatbot />
    </div>
  );
};

export default DashBoard;

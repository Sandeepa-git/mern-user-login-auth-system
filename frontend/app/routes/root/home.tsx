import React from "react";
import type { Route } from "./+types/home";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { SiMongodb, SiExpress, SiReact, SiNodedotjs } from "react-icons/si";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TaskHub" },
    { name: "description", content: "Welcome to TaskHub!" },
  ];
}

const Homepage = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-50 px-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Welcome to TaskHub</h1>

      {/* MERN Stack Icons */}
      <div className="flex gap-10 text-5xl text-blue-600 mb-10">
        <SiMongodb title="MongoDB" className="text-green-600" />
        <SiExpress title="Express" className="text-gray-800" />
        <SiReact title="React" className="text-blue-500" />
        <SiNodedotjs title="Node.js" className="text-green-700" />
      </div>

      {/* Buttons */}
      <div className="flex gap-6">
        <Link to="/sign-in">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md shadow-md transition">
            Login
          </Button>
        </Link>
        <Link to="/sign-up">
          <Button
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-md shadow-md transition"
          >
            Sign Up
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Homepage;

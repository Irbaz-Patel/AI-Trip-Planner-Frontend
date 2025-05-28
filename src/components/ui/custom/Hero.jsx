import React from "react";
import { Button } from "../button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="flex flex-col items-center mt-12 px-4 md:mx-20 lg:mx-40 xl:mx-56 gap-5 md:gap-9 py-8 md:py-12">
      <h1 className="font-extrabold text-4xl md:text-5xl lg:text-6xl text-center leading-tight md:leading-snug">
        <span className="bg-gradient-to-r from-[#f56551] to-[#ff8b7d] text-transparent bg-clip-text animate-gradient">
          Discover Your Next Adventure with AI:
        </span>
        <br className="hidden md:block" />
        <span className="inline-block mt-3 md:mt-4 text-gray-800 hover:translate-x-1 transition-transform duration-300">
          Personalized itineraries at Your Fingertips
        </span>
      </h1>

      <p className="text-lg md:text-xl text-gray-500/90 text-center max-w-3xl mx-4 md:mx-8 leading-relaxed">
        Your personal trip planner and travel curator, creating custom
        itineraries
        <span className="hidden md:inline">
          {" "}
          tailored to your interests and budget
        </span>
        .
      </p>

      <Link
        to={"/create-trip"}
        className="group relative hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
      >
        <Button className="rounded-full px-8 py-6 text-lg md:text-xl bg-[#f56551] hover:bg-[#e55a47] font-semibold shadow-md transform transition-all duration-300 group-hover:scale-105">
          🚀 Get Started, It's Free
        </Button>
      </Link>
    </div>
  );
};

export default Hero;

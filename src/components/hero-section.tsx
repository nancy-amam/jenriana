import React from "react";

const HeroSection = () => {
  return (
    <section
      className="relative py-32 w-full bg-cover bg-center"
      style={{ backgroundImage: `url('/images/hero-bg.png')` }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-4">
        <span className="bg-white/20 text-white px-4 py-1 rounded-full text-sm mb-4">Your Home for Every Stay</span>
        <h1 className="text-3xl md:text-5xl font-bold text-white max-w-4xl leading-tight">
          Premium Apartments Designed for Comfort & Convenience
        </h1>
        <p className="mt-4 text-base md:text-lg text-white/90 max-w-xl">
          Premium Apartments Designed for Comfort & Convenience
        </p>
      </div>
    </section>
  );
};

export default HeroSection;

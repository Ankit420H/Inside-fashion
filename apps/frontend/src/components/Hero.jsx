import React, { useState, useEffect } from "react";
import hero_img2 from "../assets/hero1.png";
import hero_img from "../assets/hero2.png";
import hero_img3 from "../assets/hero3.png";
const HeroSlider = () => {
  const slides = [
    {
      quote: "Latest Arrivals",
      image: hero_img,
    },
    {
      quote: "Our New Collection",
      image: hero_img2,
    },
    {
      quote: "Discover Your Style",
      image: hero_img3,
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 3000); // Slide changes every 3 seconds
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="flex flex-col sm:flex-row border border-gray-400 h-[70vh]">
      {" "}
      {/* Set 70% of viewport height */}
      {/* Hero Left Side */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0 transition-opacity duration-700 h-full">
        <div className="text-[#414141]">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p className="font-medium text-sm md:text-base">OUR BESTSELLERS</p>
          </div>
          <h1 className="prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed transition-all duration-700 ease-in-out">
            {slides[currentSlide].quote}
          </h1>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm md:text-base">SHOP NOW</p>
            <p className="w-8 md:w-11 h-[1px] bg-[#414141]"></p>
          </div>
        </div>
      </div>
      {/* Hero Right Side */}
      <div className="w-full sm:w-1/2 h-full">
        {" "}
        {/* Full height of container */}
        <img
          className="w-full h-full object-cover transition-opacity duration-700 ease-in-out"
          src={slides[currentSlide].image}
          alt="Slide"
        />
      </div>
    </div>
  );
};

export default HeroSlider;

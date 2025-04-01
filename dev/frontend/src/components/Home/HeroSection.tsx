import * as React from "react";

export const HeroSection: React.FC = () => {
  return (
    <section className="flex-1 max-w-[500px] max-md:mb-16 max-md:text-center px-4 max-sm:px-2">
      <h1 className="inline-block mb-2.5 text-5xl font-bold text-white max-sm:text-4xl">
        HectoClash
      </h1>
      <div className="inline-block h-1 ml-8 bg-emerald-300 w-[150px] max-md:mx-auto max-md:block max-md:mt-5 max-md:mb-8 max-sm:w-[120px]" />
      <div className="mb-10 text-7xl font-bold leading-tight text-white max-sm:text-5xl max-sm:leading-snug">
        <span>Fast &nbsp;&nbsp; Paced</span>
        <br />
        <span>
          <p>Mental Math</p>
        </span>
        <span className="text-green-300">Battles</span>
      </div>
      <p className="mb-10 text-xl font-bold text-white max-w-[487px] max-sm:text-lg max-sm:max-w-full">
        A mental math game where Speed, Strategy, and Math Collide in
        Real-Time Battles!
      </p>
      <button className="mt-5 text-2xl font-bold rounded-xl border-b-4 border-solid bg-green-300 cursor-pointer border-[none] border-b-green-600 h-[55px] text-black w-[481px] max-sm:w-full max-sm:max-w-[411px] hover:bg-green-600 transition-colors">
        Login/Sign up
      </button>
    </section>
  );
};

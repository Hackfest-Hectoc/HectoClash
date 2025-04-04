"use client";
import * as React from "react";
import { Logo } from "./Logo";
import { HeroSection } from "./HeroSection";
import { GamePreview } from "./GamePreview";

const Home: React.FC = () => {
  React.useEffect(() => {
    // Load Google Fonts
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@700&family=Raleway:wght@700&family=Poppins:wght@700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <main className="relative p-6 w-full min-h-screen bg-zinc-900">
      <header className="relative">
        <Logo />
      </header>
      <section className="flex justify-center gap-8 items-center px-5 py-0 mx-auto mt-20 mb-0 max-md:flex-col max-md:items-center max-md:mt-20">
        <HeroSection />
        <GamePreview />
      </section>
    </main>
  );
};

export default Home;

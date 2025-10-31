"use client";

import React, { useEffect, useState } from "react";
import { ModeToggle } from "../../components/ModeToggle";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import logo from "@/public/logo.svg";

const LandingPageHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`    
        w-full h-20 px-4 sm:px-8 md:px-20 py-5 border-b sticky top-0 z-50 transition-all duration-300
        ${
          scrolled
            ? "bg-opacity-70 backdrop-blur-md shadow-md"
            : "bg-background"
        }
      `}
    >
      <div className="flex justify-between items-center h-full">
        <div className="flex items-center gap-2">
          <Image src={logo} height={50} width={50} alt="logo" />
          <div className="text-foreground text-lg font-bold">SOES</div>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <ModeToggle />
          <Button className="bg-green-800 font-bold text-white hover:bg-green-900">
            Get Started
          </Button>
          <Button variant="outline" className="font-bold">
            Log In
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 bg-background p-4 rounded-md border">
          <Button className="bg-green-800 font-bold text-white hover:bg-green-900 w-full">
            Get Started
          </Button>
          <Button variant="outline" className="font-bold w-full">
            Log In
          </Button>
        </div>
      )}
    </header>
  );
};

export default LandingPageHeader;

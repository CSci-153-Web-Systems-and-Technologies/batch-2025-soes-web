"use client";

import React, { useState } from "react";
import { ModeToggle } from "./ModeToggle";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const LandingPageHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full h-20 px-4 sm:px-8 md:px-20 py-5 border-b">
      <div className="flex justify-between items-center h-full">
        {/* Logo and Site Name */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/*First div is placeholder for icon ^__^*/}
          <div className="w-10 h-10 bg-green-800 rounded-[10px]" />
          <div className="text-foreground text-lg font-bold">SOES</div>
        </div>

        {/* Desktop Navigation */}
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

import { ModeToggle } from "@/components/ModeToggle";
import React from "react";

const LoginHeader = () => {
  return (
    <header
      className={`    
        w-full h-20 px-4 sm:px-8 md:px-20 py-4 border-b sticky top-0 z-50 
      `}
    >
      <div className="flex justify-between items-center h-full">
        <div className=" flex items-center">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default LoginHeader;

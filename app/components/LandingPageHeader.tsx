import React from "react";
import { ModeToggle } from "./ModeToggle";
import {Button} from "@/components/ui/button";

const LandingPageHeader = () => {
  return (
    <div className="w-full h-16 px-6 pt-4 pb-5 border-b border-border inline-flex flex-col justify-start items-start">
      <div className="self-stretch flex justify-between items-center gap-2">
        <div className="flex items-center gap-4">
          {/*Change rounded-[10px] with icon*/}
          <div className="w-8 h-8 bg-green-800 rounded-[10px]"/>
          <div className="text-foreground text-md font-bold leading-normal">
            Student Organization Election System
          </div>
        </div>

        <div className="inline-flex justify-start items-center gap-2">
          <ModeToggle />
          {/* Add Get Started Function Here!! */}
          <Button className="bg-green-800 font-bold text-white hover:bg-green-900">Get Started</Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPageHeader;

"use client";

import React, { use } from "react";
import Phone from "@/app/components/Phone";
import BlurText from "@/components/BlurText";

const page = () => {
  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };
  return (
    <div>
      {/* Section 1 */}
      <div className="w-screen h-[660px] flex flex-col justify-center items-center overflow-hidden">
        <div className="flex flex-row justify-center items-center gap-20">
          <div className="w-[600px] h-64 relative flex flex-col gap-5">
            <div className="justify-start text-foreground text-3xl font-bold italic leading-tight gap-10">
              <BlurText
                text="All Your Elections In One Place."
                delay={150}
                animateBy="words"
                direction="top"
                onAnimationComplete={handleAnimationComplete}
              />
            </div>
            <div className="justify-start text-foreground/50 text-base leading-normal">
              Streamline your student organizations elections with a secure
              transparent, and modern platform designed for administrators,
              voters, and public transparency
            </div>
          </div>
          <div className="w-96 h-[500px] relative">
            <Phone />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;

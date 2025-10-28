"use client";

import React, { use } from "react";
import Phone from "@/components/Phone";
import BlurText from "@/components/BlurText";
import { Button } from "@/components/ui/button";
import { Shield, Vote, Eye } from "lucide-react";

const page = () => {
  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };
  return (
    <div className="min-h-screen">
      {/* Section 1 */}
      <section className="py-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-8xl">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Left */}
            <div>
              <div className="mb-6 leading-tight">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                  <BlurText
                    text="All Your Elections In One Place."
                    delay={150}
                    animateBy="words"
                    direction="top"
                    onAnimationComplete={handleAnimationComplete}
                  />
                </h1>

                <p className="text-muted-foreground mb-8 max-w-3xl">
                  Streamline your student organizations elections with a secure
                  transparent, and modern platform designed for administrators,
                  voters, and public transparency
                </p>

                <Button className="w-44 h-9 bg-green-800 font-bold text-base text-white hover:bg-green-900">
                  Get Started
                </Button>

                <div className="mt-5 flex items-center gap-2">
                  <div className="flex items-center">
                    <div className="flex -space-x-2">
                      <div className="w-10 h-10 rounded-full bg-green-900/30 border-2 border-background flex items-center justify-center">
                        <Shield className="w-4 h-4 text-foreground" />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-green-900/30 border-2 border-background flex items-center justify-center">
                        <Vote className="w-4 h-4 text-foreground" />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-green-900/30 border-2 border-background flex items-center justify-center">
                        <Eye className="w-4 h-4 text-foreground" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-5 h-5 text-foreground">
                          ★
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Secure & Transparent
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="relative">
              <div className="w-full aspect-square max-w-md mx-auto flex justify-center">
                <Phone phoneState={true}/>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default page;

import React from "react";
import Phone from "@/app/components/Phone";

const page = () => {
  return (
    <div>
      {/* Section 1 */}
      <div className="w-screen h-[660px] flex flex-col justify-center items-center overflow-hidden">
        <div className="flex flex-row justify-center items-center gap-16">
          <div className="w-[550px] h-64 relative"></div>
          <div className="w-96 h-[500px] relative">
            <Phone />
          </div>
        </div>
      </div>
      Basta Page here
    </div>
  );
};

export default page;

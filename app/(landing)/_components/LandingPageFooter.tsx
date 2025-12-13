import React from "react";
import PrivacyPolicyModal from "./PrivacyPolicyModal";

const LandingPageFooter = () => {
  return (
    <div className="w-full h-20 px-4 sm:px-8 md:px-20 py-5 border-t border-border flex justify-center items-center relative">
      <div className="text-center text-foreground/50 font-bold leading-normal">
        SOES 2025
      </div>
      <div className="absolute right-4 sm:right-8 md:right-20">
        <PrivacyPolicyModal />
      </div>
    </div>
  );
};

export default LandingPageFooter;

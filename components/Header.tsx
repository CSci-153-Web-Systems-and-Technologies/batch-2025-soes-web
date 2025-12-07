import { ModeToggle } from "@/components/ModeToggle";
import React from "react";
import Image from "next/image";
import logo from "@/public/logo.svg";
import { redirect } from "next/navigation";

const LoginHeader = () => {
  return (
    <header className="w-full h-20 px-4 sm:px-8 md:px-20 py-5 border-b sticky top-0 z-50 ">
      <div className="flex justify-between items-center h-full">
        <div className="flex items-center gap-2">
          <Image src={logo} height={50} width={50} alt="logo" />
          <h1
            className="text-foreground text-lg font-bold"
            onClick={() => redirect("/")}
          >
            SOES
          </h1>
        </div>
        <div className="items-center ">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default LoginHeader;

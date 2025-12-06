import React from "react";
import { CheckLine, ChartColumnBig, Users, CheckSquare } from "lucide-react";
import Tilt from "react-parallax-tilt";
import logo from "@/public/logo.svg";
import Image from "next/image";

interface PhoneProps {
  phoneState: boolean;
}

const StateOne = () => {
  return (
    <div className="self-stretch h-[452px] pl-6 pt-6 pb-4 bg-border rounded-[32px] flex flex-col justify-center items-start gap-6">
      <div className="w-40 h-8 inline-flex justify-between items-center">
        <Image src={logo} height={40} width={40} alt="logo" />
        <div className="w-8 h-8 relative bg-foreground/20 rounded-full" />
      </div>
      <div className="w-40 flex-1 flex flex-col justify-start items-start gap-3">
        <div className="self-stretch h-24 relative bg-background rounded-2xl outline outline-offset-[-1px] outline-border0">
          <div className="w-32 h-10 left-[17px] top-[17px] absolute inline-flex justify-start items-center gap-3">
            <div className="w-10 h-10 relative bg-foreground/20 rounded-full" />
            <div className="flex-1 h-3 relative bg-gray-200 rounded" />
          </div>
          <div className="w-24 h-2 left-[17px] top-[65px] absolute bg-gray-200 rounded" />
        </div>
        <div className="self-stretch h-24 relative bg-green-800/5 rounded-2xl outline outline-offset-[-1px] outline-green-800/20">
          <div className="w-32 h-10 left-[17px] top-[17px] absolute inline-flex justify-start items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-800 to-green-600 rounded-full flex justify-center items-center">
              <div className="w-5 h-5 relative overflow-hidden">
                <CheckLine className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex-1 h-3 relative bg-green-800/20 rounded" />
          </div>
          <div className="w-20 h-2 left-[17px] top-[65px] absolute bg-green-800/20 rounded" />
        </div>
        <div className="self-stretch h-24 relative bg-background rounded-2xl outline outline-offset-[-1px] outline-border0">
          <div className="w-32 h-10 left-[17px] top-[17px] absolute inline-flex justify-start items-center gap-3">
            <div className="w-10 h-10 relative bg-foreground/20 rounded-full" />
            <div className="flex-1 h-3 relative bg-gray-200 rounded" />
          </div>
          <div className="w-24 h-2 left-[17px] top-[65px] absolute bg-gray-200 rounded" />
        </div>
      </div>
      <div className="w-40 h-11 px-8 pt-2 pb-2 bg-gradient-to-br from-green-600 to-green-800 rounded-2xl flex flex-col justify-start items-center">
        <div className="self-stretch h-3 relative bg-white/20 rounded" />
      </div>
    </div>
  );
};

const StateTwo = () => {
  return (
    <div className="self-stretch h-[456px] pt-6 pb-9 bg-gradient-to-br from-green-800 to-green-600 rounded-[32px] inline-flex flex-col justify-start items-center gap-5">
      <div className="self-stretch px-4">
        <h2 className="text-white text-lg font-bold leading-6 pt-3">
          Election Dashboard
        </h2>
      </div>

      <div className="w-full px-4 flex-1 flex flex-col justify-start items-start gap-4">
        <div className="self-stretch min-h-[5rem] px-4 py-3 bg-black/20 rounded-2xl flex flex-col justify-start items-start gap-2">
          <div className="self-stretch h-5 inline-flex justify-between items-center">
            <div className="flex justify-start items-start">
              <div className="text-green-100 text-sm font-normal leading-5">
                Total Votes
              </div>
            </div>
            <div className="w-4 h-4 relative overflow-hidden">
              <ChartColumnBig className="w-4 h-4 text-green-200" />
            </div>
          </div>
          <div className="self-stretch">
            <div className="text-white text-xl font-bold leading-6">1,247</div>
          </div>
        </div>

        <div className="self-stretch min-h-[5rem] px-4 py-3 bg-black/20 rounded-2xl flex flex-col justify-start items-start gap-2">
          <div className="self-stretch h-5 inline-flex justify-between items-center">
            <div className="flex justify-start items-start">
              <div className="text-green-100 text-sm font-normal leading-5">
                Participation
              </div>
            </div>
            <div className="w-4 h-4 relative overflow-hidden">
              <Users className="w-4 h-4 text-green-200" />
            </div>
          </div>
          <div className="self-stretch">
            <div className="text-white text-xl font-bold leading-6">82.3%</div>
          </div>
        </div>

        <div className="self-stretch min-h-[5rem] px-4 py-3 bg-black/20 rounded-2xl flex flex-col justify-start items-start gap-2">
          <div className="self-stretch h-5 inline-flex justify-between items-center">
            <div className="flex justify-start items-start">
              <div className="text-green-100 text-sm font-normal leading-5">
                Active Elections
              </div>
            </div>
            <div className="w-4 h-4 relative overflow-hidden">
              <CheckSquare className="w-4 h-4 text-green-200" />
            </div>
          </div>
          <div className="self-stretch">
            <div className="text-white text-xl font-bold leading-6">3</div>
          </div>
        </div>
      </div>

      <div className="w-full px-7">
        <div className="w-full py-2 bg-white rounded-full flex justify-center items-center">
          <div className="text-green-900 text-sm font-bold leading-none">
            View Full Report
          </div>
        </div>
      </div>
    </div>
  );
};

const Phone = ({ phoneState }: PhoneProps) => {
  return (
    <Tilt tiltReverse={true} tiltMaxAngleX={5} tiltMaxAngleY={5}>
      <div className="w-64 h-[500px] px-6 pt-6 pb-2 bg-background rounded-[48px] shadow-foreground shadow-2xl/30 outline outline-offset-[-8px] outline-border inline-flex flex-col justify-start items-start">
        {phoneState ? <StateOne /> : <StateTwo />}
      </div>
    </Tilt>
  );
};

export default Phone;

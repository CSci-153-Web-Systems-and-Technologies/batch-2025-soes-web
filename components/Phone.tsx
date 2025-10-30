import React from "react";
import { CheckLine, SearchCheck } from "lucide-react";
import Tilt from "react-parallax-tilt";

interface PhoneProps {
  phoneState: boolean;
}

const StateOne = () => {
  return (
    <div className="self-stretch h-[452px] pl-6 pt-6 pb-4 bg-border rounded-[32px] flex flex-col justify-center items-start gap-6">
      <div className="w-40 h-8 inline-flex justify-between items-center">
        <div className="w-8 h-8 bg-green-800 rounded-[10px]" />
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
            <div className="w-10 h-10 bg-green-800 rounded-full flex justify-center items-center">
              <div className="w-5 h-5 relative overflow-hidden">
                <CheckLine className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex-1 h-3 relative bg-green-800/20 rounded" />
          </div>
          <div className="w-20 h-2 left-[17px] top-[65px] absolute bg-green-800/20 rounded" />
        </div>
        <div className="self-stretch h-24 relative bg-background rounded-2xl outline outline-offset-[-1px] outline-border">
          <div className="w-32 h-10 left-[17px] top-[17px] absolute inline-flex justify-start items-center gap-3">
            <div className="w-10 h-10 relative bg-foreground/20 rounded-full" />
            <div className="flex-1 h-3 relative bg-gray-200 rounded" />
          </div>
          <div className="w-16 h-2 left-[17px] top-[65px] absolute bg-gray-200 rounded" />
        </div>
      </div>
      <div className="w-40 h-11 px-8 pt-2 pb-2 bg-green-800 rounded-2xl flex flex-col justify-start items-center">
        <div className="self-stretch h-3 relative bg-white/20 rounded" />
      </div>
    </div>
  );
};

const StateTwo = () => {
  return (
    <div className="self-stretch h-[456px] pt-6 pb-5 bg-green-800 rounded-[32px] inline-flex flex-col justify-start items-center gap-6">
      <div className="w-40 h-12 relative">
        <div className="w-32 h-12 left-0 top-0 absolute">
          <div className="w-20 left-0 top-[-2.50px] absolute justify-start text-white text-base font-bold  leading-6">
            Election Dashboard
          </div>
        </div>
        <SearchCheck
          className="w-7 h-8 left-[131.85px] top-[8px] absolute"
          color="white"
        />
      </div>
      <div className="w-40 flex-1 flex flex-col justify-start items-start gap-4">
        <div className="self-stretch h-20 px-4 pt-4 bg-white/10 rounded-2xl flex flex-col justify-start items-start gap-3">
          <div className="self-stretch h-5 inline-flex justify-between items-center">
            <div className="w-20 h-5 flex justify-start items-start">
              <div className="justify-start text-white text-sm font-normal leading-5">
                Total Votes
              </div>
            </div>
            <div className="w-4 h-4 relative overflow-hidden">
              <div className="w-3 h-3 left-[2px] top-[2px] absolute outline outline-offset-[-0.67px] outline-white" />
              <div className="w-0 h-1.5 left-[12px] top-[6px] absolute outline outline-offset-[-0.67px] outline-white" />
              <div className="w-0 h-2 left-[8.67px] top-[3.33px] absolute outline outline-offset-[-0.67px] outline-white" />
              <div className="w-0 h-0.5 left-[5.33px] top-[9.33px] absolute outline outline-offset-[-0.67px] outline-white" />
            </div>
          </div>
          <div className="self-stretch h-6 relative">
            <div className="left-0 top-[-2.50px] absolute justify-start text-white text-base font-bold  leading-6">
              1,247
            </div>
          </div>
        </div>
        <div className="self-stretch h-20 px-4 pt-4 bg-white/10 rounded-2xl flex flex-col justify-start items-start gap-3">
          <div className="self-stretch h-5 inline-flex justify-between items-center">
            <div className="w-20 h-5 flex justify-start items-start">
              <div className="flex-1 justify-start text-white text-sm font-normal  leading-5">
                Participation
              </div>
            </div>
            <div className="w-4 h-4 relative overflow-hidden">
              <div className="w-2.5 h-1 left-[1.33px] top-[10px] absolute outline outline-offset-[-0.67px] outline-white" />
              <div className="w-0.5 h-[5.16px] left-[10.67px] top-[2.09px] absolute outline outline-offset-[-0.67px] outline-white" />
              <div className="w-0.5 h-1 left-[12.67px] top-[10.09px] absolute outline outline-offset-[-0.67px] outline-white" />
              <div className="w-1.5 h-1.5 left-[3.33px] top-[2px] absolute outline outline-offset-[-0.67px] outline-white" />
            </div>
          </div>
          <div className="self-stretch h-6 relative">
            <div className="left-0 top-[-2.50px] absolute justify-start text-white text-base font-bold  leading-6">
              82.3%
            </div>
          </div>
        </div>
        <div className="self-stretch h-20 px-4 pt-4 bg-white/10 rounded-2xl flex flex-col justify-start items-start gap-3">
          <div className="self-stretch h-5 inline-flex justify-between items-center">
            <div className="w-30 h-5 flex justify-start items-start">
              <div className="justify-start text-white text-sm font-normal  leading-5">
                Active Elections
              </div>
            </div>
            <div className="w-4 h-4 relative overflow-hidden">
              <div className="w-1 h-[2.67px] left-[6px] top-[6.67px] absolute outline outline-offset-[-0.67px] outline-white" />
              <div className="w-2.5 h-2.5 left-[3.33px] top-[3.33px] absolute outline outline-offset-[-0.67px] outline-white" />
              <div className="w-3.5 h-0 left-[1.33px] top-[12.67px] absolute outline outline-offset-[-0.67px] outline-white" />
            </div>
          </div>
          <div className="self-stretch h-6 relative">
            <div className="left-0 top-[-2.50px] absolute justify-start text-white text-base font-bold  leading-6">
              3
            </div>
          </div>
        </div>
      </div>
      <div className="w-36 h-6 relative bg-white rounded-2xl flex flex-col items-center">
        <div className="top-0 absolute text-green-800 text-xs font-bold leading-6">
          View Full Report
        </div>
      </div>
    </div>
  );
};

const Phone = ({ phoneState }: PhoneProps) => {
  return (
    <Tilt tiltReverse={true} tiltMaxAngleX={5} tiltMaxAngleY={5}>
      <div className="w-64 h-[500px] px-6 pt-6 pb-2 bg-background rounded-[48px] shadow-foreground shadow-2xl/50 outline outline-offset-[-8px] outline-border inline-flex flex-col justify-start items-start">
        {phoneState ? <StateOne /> : <StateTwo />}
      </div>
    </Tilt>
  );
};

export default Phone;

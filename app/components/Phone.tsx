import React from "react";
import { CheckLine } from "lucide-react";

const Phone = () => {
  return (
    <div className="w-64 h-[500px] px-6 pt-6 pb-2 bg-white rounded-[48px] shadow-2xl outline outline-8 outline-offset-[-8px] outline-neutral-950/10 inline-flex flex-col justify-start items-start">
      <div className="self-stretch h-[452px] pl-6 pt-6 pb-4 bg-gray-200/30 rounded-[32px] flex flex-col justify-start items-start gap-6">
        <div className="w-40 h-8 inline-flex justify-between items-center">
          <div className="w-8 h-8 bg-green-800 rounded-[10px]" />
          <div className="w-8 h-8 relative bg-gray-200 rounded-full" />
        </div>
        <div className="w-40 flex-1 flex flex-col justify-start items-start gap-3">
          <div className="self-stretch h-24 relative bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-black/10">
            <div className="w-32 h-10 left-[17px] top-[17px] absolute inline-flex justify-start items-center gap-3">
              <div className="w-10 h-10 relative bg-green-800/10 rounded-full" />
              <div className="flex-1 h-3 relative bg-gray-200 rounded" />
            </div>
            <div className="w-24 h-2 left-[17px] top-[65px] absolute bg-gray-200 rounded" />
          </div>
          <div className="self-stretch h-24 relative bg-green-800/5 rounded-2xl outline outline-1 outline-offset-[-1px] outline-green-800/20">
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
          <div className="self-stretch h-24 relative bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-black/10">
            <div className="w-32 h-10 left-[17px] top-[17px] absolute inline-flex justify-start items-center gap-3">
              <div className="w-10 h-10 relative bg-gray-200 rounded-full" />
              <div className="flex-1 h-3 relative bg-gray-200 rounded" />
            </div>
            <div className="w-16 h-2 left-[17px] top-[65px] absolute bg-gray-200 rounded" />
          </div>
        </div>
        <div className="w-40 h-11 px-8 pt-2 pb-2 bg-green-800 rounded-2xl flex flex-col justify-start items-center">
          <div className="self-stretch h-3 relative bg-white/20 rounded" />
        </div>
      </div>
    </div>
  );
};

export default Phone;

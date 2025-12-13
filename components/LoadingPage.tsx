import Image from "next/image";

export default function LoadingPage() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="relative flex flex-col items-center justify-center">
        {/* Spinning circle animation */}
        <div className="absolute w-24 h-24 rounded-full border-4 border-green-700/20 border-t-green-700 animate-spin" />

        {/* Logo in the center */}
        <div className="relative z-10">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={64}
            height={64}
            className="w-16 h-16"
            priority
          />
        </div>
      </div>
    </div>
  );
}

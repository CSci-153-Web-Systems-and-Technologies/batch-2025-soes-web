import { OTPForm } from "@/components/otp-form";

export default function Vote() {
  return (
    <div className="flex h-[90svh] flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-xs flex-col gap-6">
        <OTPForm />
      </div>
    </div>
  );
}

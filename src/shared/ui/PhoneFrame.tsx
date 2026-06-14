import type { ReactNode } from "react";

type PhoneFrameProps = {
  children: ReactNode;
  className?: string;
};

export function PhoneFrame({ children, className }: PhoneFrameProps) {
  return (
    <div
      className={[
        "w-full rounded-[38px] bg-[linear-gradient(180deg,#f8f2e8_0%,#f4ede2_100%)] p-3 shadow-[0_24px_70px_rgba(95,73,38,0.12)]",
        className,
      ].join(" ")}
    >
      <div className="rounded-[32px] bg-white p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
        <div className="rounded-[28px] bg-[linear-gradient(180deg,#ffffff_0%,#fffdf9_100%)] p-5 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

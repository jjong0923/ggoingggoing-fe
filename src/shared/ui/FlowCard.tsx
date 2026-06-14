import type { ReactNode } from "react";

type FlowCardProps = {
  children: ReactNode;
  title: string;
};

export function FlowCard({ children, title }: FlowCardProps) {
  return (
    <div className="rounded-[24px] border border-[#eadfce] bg-[#fffaf4] p-4">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <div className="mt-2 text-sm leading-6 text-slate-600">{children}</div>
    </div>
  );
}

import type { ReactNode } from "react";

type PageSectionProps = {
  children: ReactNode;
  eyebrow?: string;
  title: string;
};

export function PageSection({
  children,
  eyebrow,
  title,
}: PageSectionProps) {
  return (
    <section className="rounded-[28px] border border-[#e7dccb] bg-white/90 p-5 shadow-[0_16px_48px_rgba(96,74,43,0.08)]">
      <div className="mb-4">
        {eyebrow ? (
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#c17a2c]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-900">
          {title}
        </h2>
      </div>
      <div className="space-y-3 text-sm leading-6 text-slate-600">{children}</div>
    </section>
  );
}

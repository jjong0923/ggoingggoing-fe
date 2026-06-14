import type { ReactNode } from "react";

type ShowcaseLayoutProps = {
  children: ReactNode;
  phone: ReactNode;
};

export function ShowcaseLayout({ children, phone }: ShowcaseLayoutProps) {
  return (
    <div className="relative overflow-hidden px-4 py-6 md:px-8 md:py-8">
      <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-[#ffe0b5]/35 blur-3xl" />
      <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-[#d8d0ff]/40 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-6.5rem)] max-w-7xl gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-start">
        <section className="flex flex-col justify-center px-2 py-6 md:px-6 xl:pt-10">
          {children}
        </section>

        <section className="mx-auto flex w-full max-w-[430px] justify-center xl:justify-end xl:pt-10">
          {phone}
        </section>
      </div>
    </div>
  );
}

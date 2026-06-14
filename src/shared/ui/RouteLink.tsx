import type { ReactNode } from "react";
import { navigateTo } from "../lib/router";

type RouteLinkProps = {
  children: ReactNode;
  className?: string;
  href: string;
};

export function RouteLink({ children, className, href }: RouteLinkProps) {
  return (
    <a
      className={className}
      href={href}
      onClick={(event) => {
        event.preventDefault();
        navigateTo(href);
      }}
    >
      {children}
    </a>
  );
}

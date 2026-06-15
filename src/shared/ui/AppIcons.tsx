import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function BellIcon(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d="M9.5 18C9.7 19.15 10.7 20 12 20C13.3 20 14.3 19.15 14.5 18M6 9.5C6 6.46 8.46 4 11.5 4H12.5C15.54 4 18 6.46 18 9.5V12.17C18 12.7 18.21 13.2 18.59 13.57L19.41 14.4C20.04 15.03 19.59 16.1 18.7 16.1H5.3C4.41 16.1 3.96 15.03 4.59 14.4L5.41 13.57C5.79 13.2 6 12.7 6 12.17V9.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function UserCircleIcon(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d="M20 12C20 16.42 16.42 20 12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 12.25C13.52 12.25 14.75 11.02 14.75 9.5C14.75 7.98 13.52 6.75 12 6.75C10.48 6.75 9.25 7.98 9.25 9.5C9.25 11.02 10.48 12.25 12 12.25Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M7.8 17.76C8.8 15.98 10.28 15 12 15C13.72 15 15.2 15.98 16.2 17.76"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle cx="11" cy="11" r="5.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M15.2 15.2L19 19"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function SlidersIcon(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d="M7 6H18M6 12H18M6 18H17"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <circle cx="5" cy="6" r="1.5" fill="currentColor" />
      <circle cx="8" cy="12" r="1.5" fill="currentColor" />
      <circle cx="19" cy="18" r="1.5" fill="currentColor" />
    </svg>
  );
}

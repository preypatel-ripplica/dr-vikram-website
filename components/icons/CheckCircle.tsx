type CheckCircleProps = {
  className?: string;
};

export function CheckCircle({ className }: CheckCircleProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.6666 7.38667V8C14.6658 9.43762 14.2003 10.8364 13.3395 11.9879C12.4788 13.1393 11.2688 13.9817 9.8902 14.3893C8.51163 14.797 7.03813 14.748 5.68996 14.2497C4.3418 13.7514 3.19106 12.8304 2.40977 11.6239C1.62848 10.4175 1.25843 8.99095 1.35496 7.55691C1.45149 6.12287 2.00943 4.75897 2.94537 3.6679C3.88131 2.57682 5.14454 1.81764 6.5461 1.50384C7.94767 1.19004 9.41157 1.33861 10.72 1.92667"
        stroke="#8C8C90"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
      <path
        d="M14.6667 2.66667L8 9.34L6 7.34"
        stroke="#8C8C90"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}

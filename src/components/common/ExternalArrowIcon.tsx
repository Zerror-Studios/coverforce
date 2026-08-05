type ExternalArrowIconProps = {
    className?: string;
  };
  
  const ExternalArrowIcon = ({ className = "" }: ExternalArrowIconProps) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 16"
        fill="none"
        className={`external-arrow-icon shrink-0 ${className}`}
        aria-hidden
      >
        <path
          d="M6 14L18 2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.5 2H18V9.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };
  
  export default ExternalArrowIcon;
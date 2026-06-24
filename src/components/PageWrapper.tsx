import type { ReactNode } from "react";

const PageWrapper = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
  return <div className={`bg-white ${className}`.trim()}>{children}</div>;
};

export default PageWrapper;

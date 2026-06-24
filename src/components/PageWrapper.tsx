import type { ReactNode } from "react";

const PageWrapper = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
  return <div className={className}>{children}</div>;
};

export default PageWrapper;

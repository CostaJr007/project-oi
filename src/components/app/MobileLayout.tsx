import { ReactNode } from "react";

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
}

const MobileLayout = ({ children, className = "" }: MobileLayoutProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/50">
      <div className={`relative w-full max-w-[430px] min-h-screen bg-background shadow-2xl overflow-hidden ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default MobileLayout;

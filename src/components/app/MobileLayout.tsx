import { ReactNode } from "react";
import BottomNav from "./BottomNav";

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
  hideNav?: boolean;
}

const MobileLayout = ({ children, className = "", hideNav = false }: MobileLayoutProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background md:bg-muted/50">
      <div className={`relative w-full max-w-[430px] min-h-screen bg-background md:shadow-2xl overflow-hidden ${className}`}>
        {children}
        {!hideNav && <BottomNav />}
      </div>
    </div>
  );
};

export default MobileLayout;

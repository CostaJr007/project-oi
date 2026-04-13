import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: ReactNode;
  icon?: ReactNode;
}

const MobileHeader = ({ title, subtitle, onBack, rightAction, icon }: MobileHeaderProps) => {
  return (
    <header className="flex items-center gap-3 px-4 py-3 border-b border-border glass sticky top-0 z-40">
      {onBack && (
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowLeft size={18} className="text-foreground" />
        </button>
      )}
      {icon && (
        <div className="w-9 h-9 rounded-xl gradient-ai flex items-center justify-center shrink-0">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-bold text-foreground truncate">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
      </div>
      {rightAction && <div className="shrink-0">{rightAction}</div>}
    </header>
  );
};

export default MobileHeader;

import { Home, MessageSquare, BookOpen, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const tabs = [
  { icon: Home, label: "Início", path: "/app" },
  { icon: MessageSquare, label: "Chat IA", path: "/app/chat" },
  { icon: BookOpen, label: "Estudar", path: "/app" },
  { icon: Settings, label: "Config", path: "/app/settings" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border safe-bottom">
      <div className="flex items-center justify-around py-1.5 px-2 max-w-[430px] mx-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="relative flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl transition-all min-w-[64px]"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-2xl bg-primary/10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 2}
                className={`relative z-10 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}
              />
              <span
                className={`relative z-10 text-[10px] font-semibold transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;

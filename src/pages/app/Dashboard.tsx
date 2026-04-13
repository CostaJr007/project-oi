import { motion } from "framer-motion";
import { Mic, Camera, MessageSquare, Brain, BookOpen, PenTool, Presentation, GraduationCap, Bell, Search, TrendingUp, Clock, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/app/MobileLayout";
import BottomNav from "@/components/app/BottomNav";

const features = [
  { icon: Mic, label: "Gravar Aula", color: "from-secondary to-teal-400", bg: "bg-secondary-50", path: "/app/recorder" },
  { icon: Camera, label: "Resolver", color: "from-accent to-orange-400", bg: "bg-accent-50", path: "/app/snapper" },
  { icon: MessageSquare, label: "Chat IA", color: "from-primary to-purple-500", bg: "bg-primary-50", path: "/app/chat" },
  { icon: Brain, label: "Quiz", color: "from-pink-500 to-rose-400", bg: "bg-primary-50", path: "/app/quiz" },
  { icon: BookOpen, label: "Flashcards", color: "from-info to-cyan-400", bg: "bg-primary-50", path: "/app/study" },
  { icon: PenTool, label: "Escrever", color: "from-violet-500 to-purple-400", bg: "bg-primary-50", path: "/app/chat" },
  { icon: Presentation, label: "Slides", color: "from-amber-500 to-orange-400", bg: "bg-accent-50", path: "/app/chat" },
  { icon: GraduationCap, label: "Tese", color: "from-emerald-500 to-green-400", bg: "bg-secondary-50", path: "/app/chat" },
];

const recentItems = [
  { title: "Aula de Cálculo II", time: "Há 2 horas", icon: Mic, type: "Gravação" },
  { title: "Quiz de Física", time: "Ontem", icon: Brain, type: "Quiz" },
  { title: "Resumo: React Hooks", time: "Há 3 dias", icon: BookOpen, type: "Resumo" },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm text-muted-foreground">Olá, 👋</p>
              <h1 className="text-xl font-bold text-foreground">Estudante</h1>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center relative">
                <Bell size={20} className="text-foreground" />
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-5">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar aulas, resumos, quizzes..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Stats */}
          <div className="flex gap-3 mb-5">
            <div className="flex-1 bg-primary-50 rounded-xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
                <Flame size={18} className="text-white" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">7</p>
                <p className="text-[11px] text-muted-foreground">Dias seguidos</p>
              </div>
            </div>
            <div className="flex-1 bg-secondary-50 rounded-xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg gradient-secondary flex items-center justify-center">
                <TrendingUp size={18} className="text-white" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">85%</p>
                <p className="text-[11px] text-muted-foreground">Desempenho</p>
              </div>
            </div>
            <div className="flex-1 bg-accent-50 rounded-xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg gradient-accent flex items-center justify-center">
                <Clock size={18} className="text-white" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">12h</p>
                <p className="text-[11px] text-muted-foreground">Esta semana</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 pb-24">
          {/* Features Grid */}
          <h2 className="text-base font-bold text-foreground mb-3">Ferramentas</h2>
          <div className="grid grid-cols-4 gap-3 mb-6">
            {features.map((f, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.93 }}
                onClick={() => navigate(f.path)}
                className="flex flex-col items-center gap-1.5"
              >
                <div className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center`}>
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center`}>
                    <f.icon size={18} className="text-white" />
                  </div>
                </div>
                <span className="text-[11px] font-medium text-foreground">{f.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Recent */}
          <h2 className="text-base font-bold text-foreground mb-3">Recentes</h2>
          <div className="space-y-3">
            {recentItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                  <item.icon size={18} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.type} · {item.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <BottomNav />
      </div>
    </MobileLayout>
  );
};

export default Dashboard;

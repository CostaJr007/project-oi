import { motion } from "framer-motion";
import { Menu, Flame, TrendingUp, Clock, BookOpen, Brain, Sparkles, Plus, FolderOpen, GraduationCap } from "lucide-react";
import { useStudy } from "@/contexts/StudyContext";
import StudySidebar from "@/components/app/StudySidebar";
import FlashcardsTab from "@/components/app/FlashcardsTab";
import QuizTab from "@/components/app/QuizTab";
import NotesTab from "@/components/app/NotesTab";
import ImportTab from "@/components/app/ImportTab";

const tabItems = [
  { key: "flashcards", label: "Flashcards", icon: BookOpen },
  { key: "notes", label: "Resumos", icon: Sparkles },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "import", label: "Aulas", icon: GraduationCap },
];

const Dashboard = () => {
  const { selectedFolder, sidebarOpen, setSidebarOpen, activeTab, setActiveTab, folders } = useStudy();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <StudySidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-3 px-4 lg:px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
            <Menu size={18} />
          </button>
          <div className="flex-1">
            {selectedFolder ? (
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedFolder.icon}</span>
                <h1 className="text-lg font-bold text-foreground">{selectedFolder.name}</h1>
              </div>
            ) : (
              <h1 className="text-lg font-bold text-foreground">StudyFlow</h1>
            )}
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {selectedFolder ? (
            <div className="max-w-3xl mx-auto px-4 lg:px-6 py-5">
              {/* Tabs */}
              <div className="flex gap-1 p-1 bg-muted rounded-xl mb-6 overflow-x-auto">
                {tabItems.map((tab) => {
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`relative flex-1 min-w-0 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTabBg"
                          className="absolute inset-0 bg-card rounded-lg shadow-sm"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative flex items-center gap-1.5">
                        <tab.icon size={14} />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Tab content */}
              {activeTab === "flashcards" && <FlashcardsTab />}
              {activeTab === "notes" && <NotesTab />}
              {activeTab === "quiz" && <QuizTab />}
              {activeTab === "import" && <ImportTab />}
            </div>
          ) : (
            /* Welcome dashboard */
            <div className="max-w-3xl mx-auto px-4 lg:px-6 py-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl gradient-ai flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
                  <GraduationCap size={32} className="text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Olá, Estudante! 👋</h2>
                <p className="text-muted-foreground">Selecione um assunto na barra lateral ou crie um novo</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="bg-card border border-border rounded-xl p-4 text-center">
                  <div className="w-10 h-10 rounded-lg gradient-ai flex items-center justify-center mx-auto mb-2">
                    <Flame size={18} className="text-primary-foreground" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">7</p>
                  <p className="text-[11px] text-muted-foreground">Dias seguidos</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4 text-center">
                  <div className="w-10 h-10 rounded-lg gradient-success flex items-center justify-center mx-auto mb-2">
                    <TrendingUp size={18} className="text-secondary-foreground" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">85%</p>
                  <p className="text-[11px] text-muted-foreground">Desempenho</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4 text-center">
                  <div className="w-10 h-10 rounded-lg gradient-warm flex items-center justify-center mx-auto mb-2">
                    <Clock size={18} className="text-accent-foreground" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">12h</p>
                  <p className="text-[11px] text-muted-foreground">Esta semana</p>
                </div>
              </div>

              {/* Quick folders */}
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Seus Assuntos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {folders.map((folder, i) => (
                  <motion.button
                    key={folder.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => {
                      const { selectFolder } = useStudy as any; // use context properly below
                    }}
                    className="bg-card border border-border rounded-xl p-4 flex items-center gap-3 text-left hover:border-primary/30 transition-colors group"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${folder.color} flex items-center justify-center text-xl`}>
                      {folder.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{folder.name}</p>
                      <p className="text-xs text-muted-foreground">{folder.flashcardsCount} cards · {folder.quizScore}% quiz</p>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Mobile hint */}
              <p className="text-center text-xs text-muted-foreground mt-8 lg:hidden">
                Toque no ☰ para abrir seus assuntos
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

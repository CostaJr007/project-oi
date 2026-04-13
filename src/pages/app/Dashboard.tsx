import { motion } from "framer-motion";
import { Flame, TrendingUp, Clock, BookOpen, Brain, Sparkles, GraduationCap, Plus, Search, FolderOpen } from "lucide-react";
import { useStudy } from "@/contexts/StudyContext";
import FlashcardsTab from "@/components/app/FlashcardsTab";
import QuizTab from "@/components/app/QuizTab";
import NotesTab from "@/components/app/NotesTab";
import ImportTab from "@/components/app/ImportTab";
import MobileLayout from "@/components/app/MobileLayout";
import MobileHeader from "@/components/app/MobileHeader";
import { useState } from "react";

const tabItems = [
  { key: "flashcards", label: "Flashcards", icon: BookOpen },
  { key: "notes", label: "Resumos", icon: Sparkles },
  { key: "quiz", label: "Quiz", icon: Brain },
  { key: "import", label: "Aulas", icon: GraduationCap },
];

const Dashboard = () => {
  const { selectedFolder, selectFolder, activeTab, setActiveTab, folders, addFolder } = useStudy();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFolders = folders.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MobileLayout>
      <div className="flex flex-col h-screen">
        {/* Header */}
        {selectedFolder ? (
          <MobileHeader
            title={selectedFolder.name}
            subtitle={`${selectedFolder.flashcardsCount} cards · ${selectedFolder.quizScore}% quiz`}
            onBack={() => selectFolder(null)}
            icon={<span className="text-base">{selectedFolder.icon}</span>}
          />
        ) : (
          <header className="px-4 pt-6 pb-3 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-foreground">StudyFlow</h1>
                <p className="text-xs text-muted-foreground">Olá, Estudante! 👋</p>
              </div>
              <div className="w-10 h-10 rounded-full gradient-ai flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-bold">E</span>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar assuntos..."
                className="w-full py-2.5 pl-9 pr-4 rounded-xl bg-muted border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </header>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto pb-20 scrollbar-thin">
          {selectedFolder ? (
            <div className="px-4 py-4">
              {/* Tabs */}
              <div className="flex gap-1 p-1 bg-muted rounded-xl mb-5 overflow-x-auto">
                {tabItems.map((tab) => {
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`relative flex-1 min-w-0 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                        isActive ? "text-foreground" : "text-muted-foreground"
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
                        {tab.label}
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
            <div className="px-4 py-2">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-2.5 mb-6">
                <div className="bg-card border border-border rounded-xl p-3 text-center">
                  <div className="w-9 h-9 rounded-lg gradient-ai flex items-center justify-center mx-auto mb-1.5">
                    <Flame size={16} className="text-primary-foreground" />
                  </div>
                  <p className="text-xl font-bold text-foreground">7</p>
                  <p className="text-[10px] text-muted-foreground">Dias seguidos</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-3 text-center">
                  <div className="w-9 h-9 rounded-lg gradient-success flex items-center justify-center mx-auto mb-1.5">
                    <TrendingUp size={16} className="text-primary-foreground" />
                  </div>
                  <p className="text-xl font-bold text-foreground">85%</p>
                  <p className="text-[10px] text-muted-foreground">Desempenho</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-3 text-center">
                  <div className="w-9 h-9 rounded-lg gradient-warm flex items-center justify-center mx-auto mb-1.5">
                    <Clock size={16} className="text-primary-foreground" />
                  </div>
                  <p className="text-xl font-bold text-foreground">12h</p>
                  <p className="text-[10px] text-muted-foreground">Esta semana</p>
                </div>
              </div>

              {/* Folders */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Seus Assuntos</h3>
                <button
                  onClick={() => addFolder("Novo Assunto")}
                  className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center active:scale-95 transition-transform"
                >
                  <Plus size={16} className="text-primary" />
                </button>
              </div>

              {filteredFolders.length > 0 ? (
                <div className="space-y-2.5">
                  {filteredFolders.map((folder, i) => (
                    <motion.button
                      key={folder.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => selectFolder(folder.id)}
                      className="w-full bg-card border border-border rounded-xl p-4 flex items-center gap-3 text-left active:scale-[0.98] transition-transform"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${folder.color} flex items-center justify-center text-xl shrink-0`}>
                        {folder.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">{folder.name}</p>
                        <p className="text-xs text-muted-foreground">{folder.flashcardsCount} cards · {folder.quizScore}% quiz</p>
                      </div>
                      <div className="w-8 h-8 rounded-full border-2 border-primary/20 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-primary">{folder.quizScore}%</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FolderOpen size={40} className="mx-auto text-muted-foreground/40 mb-3" />
                  <p className="text-sm text-muted-foreground">Nenhum assunto encontrado</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default Dashboard;

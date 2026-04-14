import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, TrendingUp, Clock, Plus, Search, FolderOpen, BookOpen, Brain, Sparkles, Mic, FileText, Camera, Video, MoreVertical, Pencil, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStudy } from "@/contexts/StudyContext";
import FlashcardsTab from "@/components/app/FlashcardsTab";
import QuizTab from "@/components/app/QuizTab";
import NotesTab from "@/components/app/NotesTab";
import ImportTab from "@/components/app/ImportTab";
import MobileLayout from "@/components/app/MobileLayout";
import MobileHeader from "@/components/app/MobileHeader";

type ActiveView = "hub" | "flashcards" | "notes" | "quiz" | "import";

const studyActions = [
  {
    key: "flashcards" as ActiveView,
    label: "Flashcards",
    desc: "Gere e revise cards com IA",
    icon: BookOpen,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    key: "quiz" as ActiveView,
    label: "Quiz",
    desc: "Teste seus conhecimentos",
    icon: Brain,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    key: "import" as ActiveView,
    label: "Resumo YouTube",
    desc: "Cole um link e gere resumo",
    icon: Video,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    key: "route" as ActiveView,
    route: "/app/recorder",
    label: "Transcrever Aula",
    desc: "Grave ou faça upload de áudio",
    icon: Mic,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    key: "notes" as ActiveView,
    label: "Resumos & Notas",
    desc: "Veja suas anotações salvas",
    icon: FileText,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    key: "route" as ActiveView,
    route: "/app/snapper",
    label: "Problem Snapper",
    desc: "Tire foto de uma questão",
    icon: Camera,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
];

const Dashboard = () => {
  const { selectedFolder, selectFolder, folders, addFolder, renameFolder, removeFolder } = useStudy();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState<ActiveView>("hub");

  // New folder / rename modal
  const [showNameModal, setShowNameModal] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showNameModal) {
      setTimeout(() => nameInputRef.current?.focus(), 100);
    }
  }, [showNameModal]);

  const openNewFolder = () => {
    setEditingFolderId(null);
    setNameInput("");
    setShowNameModal(true);
  };

  const openRenameFolder = (id: string, currentName: string) => {
    setEditingFolderId(id);
    setNameInput(currentName);
    setShowNameModal(true);
    setMenuOpenId(null);
  };

  const handleSaveName = () => {
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    if (editingFolderId) {
      renameFolder(editingFolderId, trimmed);
    } else {
      addFolder(trimmed);
    }
    setShowNameModal(false);
    setNameInput("");
    setEditingFolderId(null);
  };

  const handleDeleteFolder = (id: string) => {
    removeFolder(id);
    setMenuOpenId(null);
  };

  const filteredFolders = folders.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectFolder = (id: string) => {
    selectFolder(id);
    setActiveView("hub");
  };

  const handleBackToHub = () => {
    setActiveView("hub");
  };

  const handleBackToHome = () => {
    selectFolder(null);
    setActiveView("hub");
  };

  const viewLabels: Record<ActiveView, string> = {
    hub: "",
    flashcards: "Flashcards",
    quiz: "Quiz",
    notes: "Resumos & Notas",
    import: "Aulas & Importar",
  };

  return (
    <MobileLayout>
      <div className="flex flex-col h-screen">
        {/* Header */}
        {selectedFolder ? (
          <MobileHeader
            title={activeView === "hub" ? selectedFolder.name : viewLabels[activeView]}
            subtitle={activeView === "hub" ? `${selectedFolder.flashcardsCount} cards · ${selectedFolder.quizScore}% quiz` : selectedFolder.name}
            onBack={activeView === "hub" ? handleBackToHome : handleBackToHub}
            icon={activeView === "hub" ? <span className="text-base">{selectedFolder.icon}</span> : undefined}
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
            activeView === "hub" ? (
              /* ===== FOLDER HUB — Action Buttons ===== */
              <div className="px-4 py-4">
                {/* Quick stats */}
                <div className="flex gap-3 mb-6">
                  <div className="flex-1 bg-card border border-border rounded-xl p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg gradient-ai flex items-center justify-center shrink-0">
                      <BookOpen size={18} className="text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">{selectedFolder.flashcardsCount}</p>
                      <p className="text-[10px] text-muted-foreground">Flashcards</p>
                    </div>
                  </div>
                  <div className="flex-1 bg-card border border-border rounded-xl p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg gradient-success flex items-center justify-center shrink-0">
                      <Brain size={18} className="text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">{selectedFolder.quizScore}%</p>
                      <p className="text-[10px] text-muted-foreground">Quiz Score</p>
                    </div>
                  </div>
                </div>

                {/* Section: O que deseja fazer? */}
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  O que deseja estudar?
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  {studyActions.map((action, i) => (
                    <motion.button
                      key={`${action.key}-${i}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setActiveView(action.key)}
                      className="bg-card border border-border rounded-2xl p-4 text-left active:border-primary/30 transition-colors flex flex-col gap-3"
                    >
                      <div className={`w-11 h-11 rounded-xl ${action.bgColor} flex items-center justify-center`}>
                        <action.icon size={20} className={action.color} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{action.label}</p>
                        <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{action.desc}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* AI tip */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 bg-primary/5 border border-primary/10 rounded-2xl p-4 flex items-start gap-3"
                >
                  <div className="w-9 h-9 rounded-lg gradient-ai flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles size={16} className="text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Dica da IA</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Comece gerando flashcards e depois faça um quiz para testar seus conhecimentos!
                    </p>
                  </div>
                </motion.div>
              </div>
            ) : (
              /* ===== Active Study View ===== */
              <div className="px-4 py-4">
                {activeView === "flashcards" && <FlashcardsTab />}
                {activeView === "notes" && <NotesTab />}
                {activeView === "quiz" && <QuizTab />}
                {activeView === "import" && <ImportTab />}
              </div>
            )
          ) : (
            /* ===== HOME — Folders List ===== */
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
                  onClick={openNewFolder}
                  className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center active:scale-95 transition-transform"
                >
                  <Plus size={16} className="text-primary" />
                </button>
              </div>

              {filteredFolders.length > 0 ? (
                <div className="space-y-2.5">
                  {filteredFolders.map((folder, i) => (
                    <motion.div
                      key={folder.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="relative"
                    >
                      <button
                        onClick={() => handleSelectFolder(folder.id)}
                        className="w-full bg-card border border-border rounded-xl p-4 flex items-center gap-3 text-left active:scale-[0.98] transition-transform"
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${folder.color} flex items-center justify-center text-xl shrink-0`}>
                          {folder.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground truncate">{folder.name}</p>
                          <p className="text-xs text-muted-foreground">{folder.flashcardsCount} cards · {folder.quizScore}% quiz</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === folder.id ? null : folder.id); }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted shrink-0"
                        >
                          <MoreVertical size={16} />
                        </button>
                      </button>

                      {/* Context menu */}
                      <AnimatePresence>
                        {menuOpenId === folder.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -4 }}
                            className="absolute right-2 top-14 z-30 bg-card border border-border rounded-xl shadow-xl overflow-hidden min-w-[160px]"
                          >
                            <button
                              onClick={() => openRenameFolder(folder.id, folder.name)}
                              className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
                            >
                              <Pencil size={14} className="text-primary" /> Renomear
                            </button>
                            <button
                              onClick={() => handleDeleteFolder(folder.id)}
                              className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-destructive hover:bg-destructive/10 transition-colors border-t border-border"
                            >
                              <Trash2 size={14} /> Excluir
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
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

        {/* Name Modal (Create / Rename) */}
        <AnimatePresence>
          {showNameModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-sm"
              onClick={() => setShowNameModal(false)}
            >
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-[430px] bg-card border-t border-border rounded-t-3xl p-6 space-y-4 safe-bottom"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-foreground">
                    {editingFolderId ? "Renomear Assunto" : "Novo Assunto"}
                  </h3>
                  <button onClick={() => setShowNameModal(false)} className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <X size={16} className="text-muted-foreground" />
                  </button>
                </div>

                <input
                  ref={nameInputRef}
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                  placeholder="Ex: Cálculo II, Física, História..."
                  className="w-full py-3 px-4 rounded-xl bg-muted border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />

                <button
                  onClick={handleSaveName}
                  disabled={!nameInput.trim()}
                  className="w-full gradient-ai text-primary-foreground font-semibold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-40 shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform"
                >
                  <Plus size={16} />
                  {editingFolderId ? "Salvar" : "Criar Assunto"}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MobileLayout>
  );
};

export default Dashboard;

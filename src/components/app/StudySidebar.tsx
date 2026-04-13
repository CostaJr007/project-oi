import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, FolderOpen, ChevronRight, GraduationCap, X, Menu, Trash2 } from "lucide-react";
import { useStudy } from "@/contexts/StudyContext";

const StudySidebar = () => {
  const { folders, selectedFolderId, selectFolder, addFolder, removeFolder, sidebarOpen, setSidebarOpen } = useStudy();
  const [search, setSearch] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);

  const filtered = folders.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      addFolder(newFolderName.trim());
      setNewFolderName("");
      setShowNewFolder(false);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:relative top-0 left-0 h-full w-72 bg-card border-r border-border z-50 flex flex-col
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          transition-transform duration-300 ease-in-out`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-ai flex items-center justify-center">
              <GraduationCap size={18} className="text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">StudyFlow</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
            <X size={16} />
          </button>
        </div>

        {/* New Folder */}
        <div className="px-4 pt-4">
          {showNewFolder ? (
            <div className="flex gap-2 mb-3">
              <input
                autoFocus
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddFolder()}
                placeholder="Nome do assunto..."
                className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button onClick={handleAddFolder} className="px-3 py-2 rounded-lg gradient-ai text-primary-foreground text-sm font-medium">
                OK
              </button>
              <button onClick={() => setShowNewFolder(false)} className="px-2 py-2 rounded-lg bg-muted text-muted-foreground">
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowNewFolder(true)}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl gradient-ai text-primary-foreground font-semibold text-sm mb-3 shadow-lg shadow-primary/20"
            >
              <Plus size={16} /> Novo Assunto
            </button>
          )}

          {/* Search */}
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar assuntos..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-muted border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Folder List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-thin">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
            Seus Assuntos ({filtered.length})
          </p>
          <div className="space-y-1">
            {filtered.map((folder) => {
              const isActive = selectedFolderId === folder.id;
              const progress = folder.quizScore;
              return (
                <motion.button
                  key={folder.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    selectFolder(folder.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors group ${
                    isActive ? "bg-primary/10 border border-primary/20" : "hover:bg-muted"
                  }`}
                >
                  {/* Progress Ring */}
                  <div className="relative w-9 h-9 flex-shrink-0">
                    <svg className="w-9 h-9 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
                      <circle
                        cx="18" cy="18" r="15" fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="3"
                        strokeDasharray={`${progress * 0.94} 94`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm">
                      {folder.icon}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isActive ? "text-primary" : "text-foreground"}`}>
                      {folder.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {folder.flashcardsCount} cards · {folder.quizScore}%
                    </p>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); removeFolder(folder.id); }}
                    className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-destructive transition-all"
                  >
                    <Trash2 size={12} />
                  </button>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default StudySidebar;

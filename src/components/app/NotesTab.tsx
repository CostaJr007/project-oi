import { motion } from "framer-motion";
import { FileText, Edit3, Trash2, Clock } from "lucide-react";
import { useStudy } from "@/contexts/StudyContext";

const NotesTab = () => {
  const { selectedFolderId, notes } = useStudy();
  const folderNotes = notes.filter((n) => n.folderId === selectedFolderId);

  if (!selectedFolderId) return null;

  return (
    <div className="space-y-4">
      {folderNotes.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <FileText size={28} className="text-muted-foreground" />
          </div>
          <p className="text-foreground font-semibold mb-1">Nenhuma nota ainda</p>
          <p className="text-sm text-muted-foreground">Importe do YouTube ou crie manualmente</p>
        </div>
      )}

      {folderNotes.map((note, i) => (
        <motion.div
          key={note.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-card border border-border rounded-xl p-4"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                note.source === "youtube" ? "bg-destructive/10 text-destructive" :
                note.source === "transcription" ? "bg-accent/10 text-accent" :
                "bg-primary/10 text-primary"
              }`}>
                {note.source === "youtube" ? "YouTube" : note.source === "transcription" ? "Transcrição" : "Manual"}
              </span>
              <h4 className="text-sm font-semibold text-foreground">{note.title}</h4>
            </div>
            <div className="flex gap-1">
              <button className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted">
                <Edit3 size={12} />
              </button>
              <button className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                <Trash2 size={12} />
              </button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground whitespace-pre-line line-clamp-4">{note.content}</p>
          <div className="flex items-center gap-1 mt-3 text-[10px] text-muted-foreground">
            <Clock size={10} />
            {note.createdAt.toLocaleDateString("pt-BR")}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default NotesTab;

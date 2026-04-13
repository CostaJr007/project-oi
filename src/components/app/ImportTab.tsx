import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Sparkles, Loader2, Link, BookOpen, Brain, Save } from "lucide-react";
import { useStudy } from "@/contexts/StudyContext";

const ImportTab = () => {
  const { selectedFolderId, addNote } = useStudy();
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const handleYoutubeSummary = () => {
    if (!youtubeUrl.trim()) return;
    setLoading(true);
    setSummary(null);

    setTimeout(() => {
      setSummary(
        "## Resumo da Aula\n\n" +
        "### Conceitos Principais\n" +
        "• **Tópico 1**: Introdução ao conteúdo abordado na aula\n" +
        "• **Tópico 2**: Desenvolvimento dos conceitos fundamentais\n" +
        "• **Tópico 3**: Aplicações práticas e exemplos\n\n" +
        "### Timestamps\n" +
        "- 00:00 - Introdução\n" +
        "- 05:30 - Conceito principal\n" +
        "- 15:00 - Exemplos práticos\n" +
        "- 25:00 - Exercícios\n" +
        "- 35:00 - Conclusão\n\n" +
        "### Pontos-Chave\n" +
        "1. O conceito fundamental é essencial para entender os próximos tópicos\n" +
        "2. A aplicação prática requer domínio da teoria\n" +
        "3. Praticar com exercícios é indispensável"
      );
      setLoading(false);
    }, 2500);
  };

  const saveSummaryAsNote = () => {
    if (summary && selectedFolderId) {
      addNote({
        folderId: selectedFolderId,
        title: `Resumo: ${youtubeUrl.slice(0, 40)}`,
        content: summary,
        source: "youtube",
        sourceUrl: youtubeUrl,
      });
      setSummary(null);
      setYoutubeUrl("");
    }
  };

  return (
    <div className="space-y-6">
      {/* YouTube Import */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center text-sm">
            ▶️
          </div>
          <h3 className="font-bold text-foreground">Importar do YouTube</h3>
        </div>

        <div className="relative mb-3">
          <Link size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="Cole a URL do YouTube aqui..."
            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-muted border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <button
          onClick={handleYoutubeSummary}
          disabled={!youtubeUrl.trim() || loading}
          className="w-full gradient-ai text-primary-foreground font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm disabled:opacity-50 shadow-lg shadow-primary/20"
        >
          {loading ? <><Loader2 size={14} className="animate-spin" /> Gerando Resumo...</> : <><Sparkles size={14} /> Gerar Resumo com IA</>}
        </button>
      </div>

      {/* Summary result */}
      {summary && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <FileText size={16} className="text-primary" /> Resumo Gerado
            </h3>
            <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">IA</span>
          </div>

          <div className="text-sm text-foreground leading-relaxed whitespace-pre-line mb-4 max-h-64 overflow-y-auto scrollbar-thin">
            {summary}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={saveSummaryAsNote}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium"
            >
              <Save size={12} /> Salvar como Nota
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium">
              <BookOpen size={12} /> Criar Flashcards
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium">
              <Brain size={12} /> Gerar Quiz
            </button>
          </div>
        </motion.div>
      )}

      {/* Transcription */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <FileText size={16} className="text-accent" />
          </div>
          <h3 className="font-bold text-foreground">Transcrever Aula</h3>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Faça upload de um arquivo de áudio (MP3/MP4) ou grave diretamente para transcrever.
        </p>

        <div className="flex gap-2">
          <button className="flex-1 py-2.5 rounded-xl border border-border bg-muted text-foreground font-medium text-sm flex items-center justify-center gap-2">
            <FileText size={14} /> Upload
          </button>
          <button className="flex-1 py-2.5 rounded-xl gradient-warm text-accent-foreground font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-accent/20">
            🎙️ Gravar
          </button>
        </div>
      </div>

      {/* Refine prompt */}
      <div className="text-center">
        <button className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mx-auto">
          <Sparkles size={12} /> Refinar com novo prompt
        </button>
      </div>
    </div>
  );
};

export default ImportTab;

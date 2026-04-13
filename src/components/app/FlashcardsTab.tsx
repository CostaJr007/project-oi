import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, BookOpen, ThumbsUp, ThumbsDown, RotateCcw, Edit3, ChevronLeft, Loader2 } from "lucide-react";
import { useStudy, Flashcard } from "@/contexts/StudyContext";

const FlashcardsTab = () => {
  const { selectedFolder, selectedFolderId, flashcards, addFlashcards } = useStudy();
  const folderCards = flashcards.filter((c) => c.folderId === selectedFolderId);

  const [showGenerate, setShowGenerate] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [cardCount, setCardCount] = useState(20);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [prompt, setPrompt] = useState("");
  const [reviewMode, setReviewMode] = useState(false);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [unknown, setUnknown] = useState(0);

  const handleGenerate = () => {
    setGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      const sampleCards = Array.from({ length: Math.min(cardCount, 10) }, (_, i) => ({
        front: `Pergunta ${i + 1} sobre ${selectedFolder?.name || "assunto"}: ${prompt || "Conceito fundamental"}`,
        back: `Resposta detalhada sobre o conceito ${i + 1}. Esta é uma explicação gerada pela IA.`,
        type: "front-back" as const,
        difficulty,
      }));
      addFlashcards(selectedFolderId!, sampleCards);
      setGenerating(false);
      setShowGenerate(false);
    }, 2000);
  };

  const nextCard = (isKnown: boolean) => {
    if (isKnown) setKnown((k) => k + 1);
    else setUnknown((u) => u + 1);
    setFlipped(false);
    setTimeout(() => {
      if (current < folderCards.length - 1) setCurrent(current + 1);
      else setReviewMode(false);
    }, 200);
  };

  if (!selectedFolderId) return null;

  // Review mode
  if (reviewMode && folderCards.length > 0) {
    const card = folderCards[current];
    return (
      <div className="flex flex-col h-full">
        {/* Review header */}
        <div className="flex items-center justify-between px-1 mb-4">
          <button onClick={() => { setReviewMode(false); setCurrent(0); setKnown(0); setUnknown(0); }} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ChevronLeft size={16} /> Voltar
          </button>
          <span className="text-sm font-medium text-muted-foreground">{current + 1}/{folderCards.length}</span>
        </div>

        {/* Progress */}
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-3">
          <motion.div className="h-full gradient-ai rounded-full" animate={{ width: `${((current + 1) / folderCards.length) * 100}%` }} />
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-6 mb-6">
          <div className="flex items-center gap-1.5 text-sm">
            <ThumbsUp size={14} className="text-secondary" />
            <span className="font-semibold text-secondary">{known}</span>
            <span className="text-muted-foreground">sei</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <ThumbsDown size={14} className="text-destructive" />
            <span className="font-semibold text-destructive">{unknown}</span>
            <span className="text-muted-foreground">revisar</span>
          </div>
        </div>

        {/* Card */}
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => setFlipped(!flipped)}
            className="w-full max-w-md aspect-[3/4] max-h-[380px] cursor-pointer"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={flipped ? "back" : "front"}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`w-full h-full rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-xl border ${
                  flipped
                    ? "bg-secondary/5 border-secondary/20"
                    : "gradient-ai border-transparent"
                }`}
              >
                <span className={`text-xs font-semibold mb-4 px-3 py-1 rounded-full ${
                  flipped ? "bg-secondary/10 text-secondary" : "bg-primary-foreground/20 text-primary-foreground"
                }`}>
                  {flipped ? "Resposta" : card?.difficulty}
                </span>
                <p className={`text-lg font-semibold leading-relaxed whitespace-pre-line ${
                  flipped ? "text-foreground" : "text-primary-foreground"
                }`}>
                  {flipped ? card?.back : card?.front}
                </p>
                {!flipped && (
                  <p className="text-primary-foreground/60 text-xs mt-6">Toque para ver a resposta</p>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Actions */}
        {flipped && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 mt-4">
            <button onClick={() => nextCard(false)} className="flex-1 py-3 rounded-xl bg-destructive/10 text-destructive font-semibold flex items-center justify-center gap-2">
              <ThumbsDown size={16} /> Revisar
            </button>
            <button onClick={() => nextCard(true)} className="flex-1 py-3 rounded-xl bg-secondary/10 text-secondary font-semibold flex items-center justify-center gap-2">
              <ThumbsUp size={16} /> Sei
            </button>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Generate button */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowGenerate(true)}
        className="w-full gradient-ai text-primary-foreground font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
      >
        <Sparkles size={18} /> Gerar Flashcards com IA
      </motion.button>

      {/* Generate Modal */}
      <AnimatePresence>
        {showGenerate && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-card border border-border rounded-2xl p-5 space-y-4"
          >
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <Sparkles size={16} className="text-primary" /> Gerar Flashcards
            </h3>

            {/* Count slider */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Quantidade</span>
                <span className="font-semibold text-foreground">{cardCount}</span>
              </div>
              <input
                type="range" min={10} max={100} step={5} value={cardCount}
                onChange={(e) => setCardCount(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            {/* Difficulty */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">Dificuldade</p>
              <div className="flex gap-2">
                {(["easy", "medium", "hard"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      difficulty === d ? "gradient-ai text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {d === "easy" ? "Fácil" : d === "medium" ? "Médio" : "Difícil"}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">Foco (opcional)</p>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: foco em derivadas parciais e integrais..."
                className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex gap-2">
              <button onClick={() => setShowGenerate(false)} className="flex-1 py-2.5 rounded-lg bg-muted text-foreground font-medium text-sm">
                Cancelar
              </button>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="flex-1 py-2.5 rounded-lg gradient-ai text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {generating ? <><Loader2 size={14} className="animate-spin" /> Gerando...</> : <><Sparkles size={14} /> Gerar</>}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards grid */}
      {folderCards.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">{folderCards.length} cards</h3>
            <button
              onClick={() => { setReviewMode(true); setCurrent(0); setFlipped(false); setKnown(0); setUnknown(0); }}
              className="text-sm font-medium text-primary flex items-center gap-1"
            >
              <BookOpen size={14} /> Revisar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {folderCards.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors"
              >
                <p className="text-sm font-medium text-foreground mb-2 line-clamp-2">{card.front}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{card.back}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    card.difficulty === "easy" ? "bg-secondary/10 text-secondary" :
                    card.difficulty === "medium" ? "bg-primary/10 text-primary" :
                    "bg-destructive/10 text-destructive"
                  }`}>
                    {card.difficulty === "easy" ? "Fácil" : card.difficulty === "medium" ? "Médio" : "Difícil"}
                  </span>
                  <button className="text-muted-foreground hover:text-foreground">
                    <Edit3 size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {folderCards.length === 0 && !showGenerate && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <BookOpen size={28} className="text-muted-foreground" />
          </div>
          <p className="text-foreground font-semibold mb-1">Nenhum flashcard ainda</p>
          <p className="text-sm text-muted-foreground">Gere flashcards com IA para começar a estudar</p>
        </div>
      )}
    </div>
  );
};

export default FlashcardsTab;

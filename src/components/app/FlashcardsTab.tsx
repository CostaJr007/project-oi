import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, BookOpen, ThumbsUp, ThumbsDown, Edit3, ChevronLeft, ChevronDown, ChevronRight, Loader2, Layers } from "lucide-react";
import { useStudy } from "@/contexts/StudyContext";

const FlashcardsTab = () => {
  const { selectedFolder, selectedFolderId, flashcards, addFlashcards } = useStudy();
  const folderCards = flashcards.filter((c) => c.folderId === selectedFolderId);

  const [showGenerate, setShowGenerate] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [cardCount, setCardCount] = useState(20);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [prompt, setPrompt] = useState("");
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewCards, setReviewCards] = useState<typeof folderCards>([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [unknown, setUnknown] = useState(0);
  const [expandedSubtopics, setExpandedSubtopics] = useState<Set<string>>(new Set());
  

  // Group cards by subtopic
  const grouped = useMemo(() => {
    const map = new Map<string, typeof folderCards>();
    folderCards.forEach((card) => {
      const key = card.subtopic || "Geral";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(card);
    });
    return Array.from(map.entries());
  }, [folderCards]);

  const toggleSubtopic = (subtopic: string) => {
    setExpandedSubtopics((prev) => {
      const next = new Set(prev);
      if (next.has(subtopic)) next.delete(subtopic);
      else next.add(subtopic);
      return next;
    });
  };

  const startReview = (cards: typeof folderCards) => {
    setReviewCards(cards);
    setReviewMode(true);
    setCurrent(0);
    setFlipped(false);
    setKnown(0);
    setUnknown(0);
  };

  const handleGenerate = () => {
    setGenerating(true);
    const subtopics = ["Conceitos Básicos", "Aplicações Práticas", "Teoria Avançada"];
    setTimeout(() => {
      const sampleCards = Array.from({ length: Math.min(cardCount, 10) }, (_, i) => ({
        front: `Pergunta ${i + 1} sobre ${selectedFolder?.name || "assunto"}: ${prompt || "Conceito fundamental"}`,
        back: `Resposta detalhada sobre o conceito ${i + 1}. Esta é uma explicação gerada pela IA.`,
        type: "front-back" as const,
        difficulty,
        subtopic: subtopics[i % subtopics.length],
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
      if (current < reviewCards.length - 1) setCurrent(current + 1);
      else setReviewMode(false);
    }, 200);
  };

  if (!selectedFolderId) return null;

  // Review mode
  if (reviewMode && reviewCards.length > 0) {
    const card = reviewCards[current];
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-1 mb-4">
          <button onClick={() => setReviewMode(false)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ChevronLeft size={16} /> Voltar
          </button>
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">{card?.subtopic}</span>
          <span className="text-sm font-medium text-muted-foreground">{current + 1}/{reviewCards.length}</span>
        </div>

        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-3">
          <motion.div className="h-full gradient-ai rounded-full" animate={{ width: `${((current + 1) / reviewCards.length) * 100}%` }} />
        </div>

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

        <div className="flex-1 flex items-center justify-center">
          <motion.div whileTap={{ scale: 0.98 }} onClick={() => setFlipped(!flipped)} className="w-full max-w-md aspect-[3/4] max-h-[380px] cursor-pointer">
            <AnimatePresence mode="wait">
              <motion.div
                key={flipped ? "back" : "front"}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`w-full h-full rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-xl border ${
                  flipped ? "bg-secondary/5 border-secondary/20" : "gradient-ai border-transparent"
                }`}
              >
                <span className={`text-xs font-semibold mb-4 px-3 py-1 rounded-full ${
                  flipped ? "bg-secondary/10 text-secondary" : "bg-primary-foreground/20 text-primary-foreground"
                }`}>
                  {flipped ? "Resposta" : card?.difficulty === "easy" ? "Fácil" : card?.difficulty === "medium" ? "Médio" : "Difícil"}
                </span>
                <p className={`text-lg font-semibold leading-relaxed whitespace-pre-line ${
                  flipped ? "text-foreground" : "text-primary-foreground"
                }`}>
                  {flipped ? card?.back : card?.front}
                </p>
                {!flipped && <p className="text-primary-foreground/60 text-xs mt-6">Toque para ver a resposta</p>}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

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
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Quantidade</span>
                <span className="font-semibold text-foreground">{cardCount}</span>
              </div>
              <input type="range" min={10} max={100} step={5} value={cardCount} onChange={(e) => setCardCount(Number(e.target.value))} className="w-full accent-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Dificuldade</p>
              <div className="flex gap-2">
                {(["easy", "medium", "hard"] as const).map((d) => (
                  <button key={d} onClick={() => setDifficulty(d)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${difficulty === d ? "gradient-ai text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {d === "easy" ? "Fácil" : d === "medium" ? "Médio" : "Difícil"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Foco (opcional)</p>
              <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ex: foco em derivadas parciais e integrais..." className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowGenerate(false)} className="flex-1 py-2.5 rounded-lg bg-muted text-foreground font-medium text-sm">Cancelar</button>
              <button onClick={handleGenerate} disabled={generating} className="flex-1 py-2.5 rounded-lg gradient-ai text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                {generating ? <><Loader2 size={14} className="animate-spin" /> Gerando...</> : <><Sparkles size={14} /> Gerar</>}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtopic groups */}
      {grouped.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Layers size={16} className="text-primary" />
              {grouped.length} {grouped.length === 1 ? "subtópico" : "subtópicos"} · {folderCards.length} cards
            </h3>
            <button
              onClick={() => startReview(folderCards)}
              className="text-sm font-medium text-primary flex items-center gap-1"
            >
              <BookOpen size={14} /> Revisar Tudo
            </button>
          </div>

          <div className="space-y-3">
            {grouped.map(([subtopic, cards], gi) => {
              const isExpanded = expandedSubtopics.has(subtopic);
              const easyCount = cards.filter((c) => c.difficulty === "easy").length;
              const mediumCount = cards.filter((c) => c.difficulty === "medium").length;
              const hardCount = cards.filter((c) => c.difficulty === "hard").length;

              return (
                <motion.div
                  key={subtopic}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: gi * 0.05 }}
                >
                  {/* Subtopic header */}
                  <button
                    onClick={() => toggleSubtopic(subtopic)}
                    className="w-full bg-card border border-border rounded-xl p-4 flex items-center gap-3 text-left active:scale-[0.98] transition-transform"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Layers size={18} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{subtopic}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-muted-foreground">{cards.length} cards</span>
                        {easyCount > 0 && <span className="text-[10px] text-secondary">●{easyCount}</span>}
                        {mediumCount > 0 && <span className="text-[10px] text-primary">●{mediumCount}</span>}
                        {hardCount > 0 && <span className="text-[10px] text-destructive">●{hardCount}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); startReview(cards); }}
                        className="text-[10px] font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-lg"
                      >
                        Revisar
                      </button>
                      <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown size={16} className="text-muted-foreground" />
                      </motion.div>
                    </div>
                  </button>

                  {/* Expanded cards */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2 pl-4 space-y-2">
                          {cards.map((card, ci) => {
                            return (
                              <motion.div
                                key={card.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: ci * 0.03 }}
                                onClick={() => {
                                  const cardIndex = folderCards.findIndex((c) => c.id === card.id);
                                  if (cardIndex !== -1) {
                                    setReviewCards(folderCards);
                                    setCurrent(cardIndex);
                                    setFlipped(false);
                                    setKnown(0);
                                    setUnknown(0);
                                    setReviewMode(true);
                                  }
                                }}
                                className="bg-card border border-border rounded-xl p-3.5 cursor-pointer active:scale-[0.98] transition-all hover:border-primary/30"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground leading-snug">
                                      {card.front}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">{card.back}</p>
                                  </div>
                                  <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                                    card.difficulty === "easy" ? "bg-secondary/10 text-secondary" :
                                    card.difficulty === "medium" ? "bg-primary/10 text-primary" :
                                    "bg-destructive/10 text-destructive"
                                  }`}>
                                    {card.difficulty === "easy" ? "Fácil" : card.difficulty === "medium" ? "Médio" : "Difícil"}
                                  </span>
                                </div>
                                <p className="text-[10px] text-primary/60 mt-2">Toque para abrir card</p>
                              </motion.div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
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

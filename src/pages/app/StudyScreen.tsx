import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, ThumbsUp, ThumbsDown, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import MobileLayout from "@/components/app/MobileLayout";
import BottomNav from "@/components/app/BottomNav";

const flashcards = [
  { front: "O que é uma derivada?", back: "A derivada mede a taxa de variação instantânea de uma função em relação à sua variável independente.", category: "Cálculo" },
  { front: "Lei de Newton (2ª)", back: "F = m × a\n\nA força resultante sobre um corpo é igual ao produto de sua massa pela aceleração.", category: "Física" },
  { front: "O que é fotossíntese?", back: "Processo pelo qual plantas convertem luz solar, CO₂ e água em glicose e oxigênio.", category: "Biologia" },
  { front: "Teorema de Pitágoras", back: "a² + b² = c²\n\nEm um triângulo retângulo, o quadrado da hipotenusa é igual à soma dos quadrados dos catetos.", category: "Matemática" },
];

const StudyScreen = () => {
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [unknown, setUnknown] = useState(0);

  const card = flashcards[current];

  const nextCard = (isKnown: boolean) => {
    if (isKnown) setKnown(known + 1);
    else setUnknown(unknown + 1);
    setFlipped(false);
    setTimeout(() => setCurrent((current + 1) % flashcards.length), 200);
  };

  return (
    <MobileLayout>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <BookOpen size={22} className="text-primary" /> Flashcards
            </h1>
            <span className="text-sm text-muted-foreground font-medium">{current + 1}/{flashcards.length}</span>
          </div>

          {/* Progress */}
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full gradient-primary rounded-full"
              animate={{ width: `${((current + 1) / flashcards.length) * 100}%` }}
            />
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-6 mt-4">
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
        </div>

        {/* Card */}
        <div className="flex-1 flex items-center justify-center px-6 pb-24">
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => setFlipped(!flipped)}
            className="w-full aspect-[3/4] max-h-[400px] cursor-pointer perspective-1000"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={flipped ? "back" : "front"}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`w-full h-full rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-xl ${
                  flipped
                    ? "bg-gradient-to-br from-secondary-50 to-white border-2 border-secondary/20"
                    : "gradient-primary"
                }`}
              >
                <span className={`text-xs font-semibold mb-4 px-3 py-1 rounded-full ${
                  flipped ? "bg-secondary/10 text-secondary" : "bg-white/20 text-white"
                }`}>
                  {flipped ? "Resposta" : card.category}
                </span>
                <p className={`text-lg font-semibold leading-relaxed whitespace-pre-line ${
                  flipped ? "text-foreground" : "text-white"
                }`}>
                  {flipped ? card.back : card.front}
                </p>
                {!flipped && (
                  <p className="text-white/60 text-xs mt-6">Toque para ver a resposta</p>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Actions */}
        {flipped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-20 left-0 right-0 flex justify-center gap-4 px-6"
          >
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => nextCard(false)}
              className="flex-1 py-3.5 rounded-xl bg-destructive/10 text-destructive font-semibold flex items-center justify-center gap-2"
            >
              <ThumbsDown size={18} /> Revisar
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => nextCard(true)}
              className="flex-1 py-3.5 rounded-xl bg-secondary/10 text-secondary font-semibold flex items-center justify-center gap-2"
            >
              <ThumbsUp size={18} /> Sei
            </motion.button>
          </motion.div>
        )}

        <BottomNav />
      </div>
    </MobileLayout>
  );
};

export default StudyScreen;

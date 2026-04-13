import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, CheckCircle2, XCircle, Trophy, RotateCcw } from "lucide-react";
import MobileLayout from "@/components/app/MobileLayout";
import BottomNav from "@/components/app/BottomNav";

const questions = [
  {
    question: "Qual é a integral de 2x?",
    options: ["x²", "x² + C", "2x²", "x"],
    correct: 1,
  },
  {
    question: "Quem pintou a Mona Lisa?",
    options: ["Michelangelo", "Leonardo da Vinci", "Rafael", "Donatello"],
    correct: 1,
  },
  {
    question: "Qual a fórmula da água?",
    options: ["CO₂", "NaCl", "H₂O", "O₂"],
    correct: 2,
  },
  {
    question: "Em que ano o Brasil foi descoberto?",
    options: ["1492", "1500", "1822", "1889"],
    correct: 1,
  },
];

const QuizScreen = () => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[current];

  const select = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === q.correct) setScore(score + 1);

    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent(current + 1);
        setSelected(null);
      } else {
        setFinished(true);
      }
    }, 1200);
  };

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <MobileLayout>
        <div className="flex flex-col h-screen">
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
              <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center mb-6 mx-auto">
                <Trophy size={40} className="text-white" />
              </div>
            </motion.div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Quiz Completo!</h1>
            <p className="text-4xl font-bold text-primary mb-1">{pct}%</p>
            <p className="text-muted-foreground mb-2">{score} de {questions.length} corretas</p>
            <p className="text-sm text-muted-foreground mb-8">
              {pct >= 80 ? "Excelente! 🎉" : pct >= 50 ? "Bom trabalho! Continue praticando 💪" : "Continue estudando! 📚"}
            </p>
            <motion.button whileTap={{ scale: 0.97 }} onClick={restart}
              className="gradient-primary text-white font-semibold py-3.5 px-8 rounded-xl flex items-center gap-2 shadow-lg shadow-primary/25">
              <RotateCcw size={18} /> Tentar Novamente
            </motion.button>
          </div>
          <BottomNav />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Brain size={22} className="text-primary" /> Quiz
            </h1>
            <span className="text-sm font-semibold text-primary bg-primary-50 px-3 py-1 rounded-full">
              {current + 1}/{questions.length}
            </span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div className="h-full gradient-primary rounded-full" animate={{ width: `${((current + 1) / questions.length) * 100}%` }} />
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 px-5 pb-24">
          <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mt-4">
            <div className="bg-primary-50 rounded-2xl p-6 mb-6">
              <p className="text-base font-semibold text-foreground leading-relaxed">{q.question}</p>
            </div>

            <div className="space-y-3">
              {q.options.map((opt, i) => {
                let style = "bg-card border border-border";
                if (selected !== null) {
                  if (i === q.correct) style = "bg-secondary/10 border-2 border-secondary";
                  else if (i === selected) style = "bg-destructive/10 border-2 border-destructive";
                }
                return (
                  <motion.button
                    key={i}
                    whileTap={selected === null ? { scale: 0.97 } : undefined}
                    onClick={() => select(i)}
                    className={`w-full text-left p-4 rounded-xl flex items-center gap-3 transition-all ${style}`}
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      selected !== null && i === q.correct ? "bg-secondary text-white" :
                      selected === i ? "bg-destructive text-white" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-sm font-medium text-foreground flex-1">{opt}</span>
                    {selected !== null && i === q.correct && <CheckCircle2 size={20} className="text-secondary" />}
                    {selected === i && i !== q.correct && <XCircle size={20} className="text-destructive" />}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>

        <BottomNav />
      </div>
    </MobileLayout>
  );
};

export default QuizScreen;

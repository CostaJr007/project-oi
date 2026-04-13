import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, CheckCircle2, XCircle, Trophy, RotateCcw, Sparkles, Settings2, Loader2 } from "lucide-react";
import { useStudy } from "@/contexts/StudyContext";

const QuizTab = () => {
  const { selectedFolder, selectedFolderId, flashcards, addQuizResult } = useStudy();
  const folderCards = flashcards.filter((c) => c.folderId === selectedFolderId);

  const [quizActive, setQuizActive] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [questionCount, setQuestionCount] = useState(5);
  const [generating, setGenerating] = useState(false);
  const [questions, setQuestions] = useState<{ question: string; options: string[]; correct: number }[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const generateQuiz = () => {
    setGenerating(true);
    setTimeout(() => {
      const generated = folderCards.slice(0, questionCount).map((card) => ({
        question: card.front,
        options: [card.back, "Alternativa incorreta A", "Alternativa incorreta B", "Alternativa incorreta C"].sort(() => Math.random() - 0.5),
        correct: 0,
      }));
      // Fix correct index after shuffle
      const fixed = generated.map((q) => {
        const correctIdx = q.options.indexOf(folderCards.find(c => c.front === q.question)?.back || "");
        return { ...q, correct: correctIdx >= 0 ? correctIdx : 0 };
      });
      setQuestions(fixed.length > 0 ? fixed : [
        { question: "Pergunta de exemplo?", options: ["Resposta correta", "Opção B", "Opção C", "Opção D"], correct: 0 },
      ]);
      setQuizActive(true);
      setGenerating(false);
      setCurrent(0);
      setSelected(null);
      setScore(0);
      setFinished(false);
    }, 1500);
  };

  const selectAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === questions[current].correct) setScore((s) => s + 1);

    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent((c) => c + 1);
        setSelected(null);
      } else {
        setFinished(true);
        addQuizResult({ folderId: selectedFolderId!, score: score + (idx === questions[current].correct ? 1 : 0), total: questions.length, weakAreas: [] });
      }
    }, 1200);
  };

  if (!selectedFolderId) return null;

  // Results screen
  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
          <div className="w-24 h-24 rounded-full gradient-ai flex items-center justify-center mb-6 mx-auto">
            <Trophy size={40} className="text-primary-foreground" />
          </div>
        </motion.div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Quiz Completo!</h2>
        <p className="text-4xl font-bold text-primary mb-1">{pct}%</p>
        <p className="text-muted-foreground mb-2">{score} de {questions.length} corretas</p>
        <p className="text-sm text-muted-foreground mb-8">
          {pct >= 80 ? "Excelente! 🎉" : pct >= 50 ? "Bom trabalho! 💪" : "Continue estudando! 📚"}
        </p>
        <button onClick={() => { setQuizActive(false); setFinished(false); }}
          className="gradient-ai text-primary-foreground font-semibold py-3 px-8 rounded-xl flex items-center gap-2 shadow-lg shadow-primary/20">
          <RotateCcw size={16} /> Tentar Novamente
        </button>
      </div>
    );
  }

  // Quiz in progress
  if (quizActive && questions.length > 0) {
    const q = questions[current];
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
            {current + 1}/{questions.length}
          </span>
          <button onClick={() => setQuizActive(false)} className="text-sm text-muted-foreground">Sair</button>
        </div>

        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-6">
          <motion.div className="h-full gradient-ai rounded-full" animate={{ width: `${((current + 1) / questions.length) * 100}%` }} />
        </div>

        <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="bg-primary/5 rounded-2xl p-5 mb-5 border border-primary/10">
            <p className="font-semibold text-foreground leading-relaxed">{q.question}</p>
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
                  whileTap={selected === null ? { scale: 0.98 } : undefined}
                  onClick={() => selectAnswer(i)}
                  className={`w-full text-left p-4 rounded-xl flex items-center gap-3 transition-all ${style}`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    selected !== null && i === q.correct ? "bg-secondary text-secondary-foreground" :
                    selected === i ? "bg-destructive text-destructive-foreground" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm font-medium text-foreground flex-1">{opt}</span>
                  {selected !== null && i === q.correct && <CheckCircle2 size={18} className="text-secondary" />}
                  {selected === i && i !== q.correct && <XCircle size={18} className="text-destructive" />}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    );
  }

  // Config screen
  return (
    <div className="space-y-4">
      <button
        onClick={generateQuiz}
        disabled={generating}
        className="w-full gradient-ai text-primary-foreground font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
      >
        {generating ? <><Loader2 size={16} className="animate-spin" /> Gerando Quiz...</> : <><Brain size={18} /> Iniciar Quiz</>}
      </button>

      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <Settings2 size={16} className="text-muted-foreground" /> Configurações
        </h3>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Número de perguntas</span>
            <span className="font-semibold text-foreground">{questionCount}</span>
          </div>
          <input
            type="range" min={3} max={20} value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div className="text-sm text-muted-foreground">
          <p>📚 {folderCards.length} flashcards disponíveis nesta pasta</p>
          <p>🧠 Quiz gerado a partir do conteúdo dos seus flashcards e notas</p>
        </div>
      </div>

      {folderCards.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">Adicione flashcards primeiro para gerar quizzes contextuais</p>
        </div>
      )}
    </div>
  );
};

export default QuizTab;

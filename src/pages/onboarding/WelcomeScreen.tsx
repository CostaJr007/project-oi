import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Camera, MessageSquare, Brain, ChevronRight, Sparkles } from "lucide-react";
import MobileLayout from "@/components/app/MobileLayout";

const slides = [
  {
    icon: Sparkles,
    color: "from-primary to-purple-500",
    bg: "bg-primary-50",
    title: "Bem-vindo ao GenioIA",
    description: "Seu assistente de estudos com inteligência artificial. Aprenda mais rápido e de forma mais inteligente.",
  },
  {
    icon: Mic,
    color: "from-secondary to-teal-400",
    bg: "bg-secondary-50",
    title: "Grave suas Aulas",
    description: "Grave e transcreva aulas automaticamente. A IA gera resumos, flashcards e quizzes a partir do conteúdo.",
  },
  {
    icon: Camera,
    color: "from-accent to-orange-400",
    bg: "bg-accent-50",
    title: "Resolva Problemas",
    description: "Tire uma foto de qualquer questão e receba soluções passo a passo com explicações detalhadas.",
  },
  {
    icon: MessageSquare,
    color: "from-info to-cyan-400",
    bg: "bg-primary-50",
    title: "Tutor IA 24/7",
    description: "Chat inteligente que entende o contexto e ajuda com qualquer matéria, a qualquer hora.",
  },
  {
    icon: Brain,
    color: "from-purple-500 to-pink-500",
    bg: "bg-primary-50",
    title: "Prepare-se para Provas",
    description: "Quizzes adaptativos, flashcards inteligentes e simulados personalizados para seu nível.",
  },
];

const WelcomeScreen = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const slide = slides[current];

  const next = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    } else {
      navigate("/login");
    }
  };

  return (
    <MobileLayout>
      <div className="flex flex-col h-screen">
        {/* Skip */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => navigate("/login")}
            className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            Pular
          </button>
        </div>

        {/* Slide Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex flex-col items-center text-center"
            >
              <div className={`w-28 h-28 rounded-3xl ${slide.bg} flex items-center justify-center mb-8`}>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${slide.color} flex items-center justify-center`}>
                  <slide.icon size={32} className="text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-3">{slide.title}</h1>
              <p className="text-muted-foreground leading-relaxed max-w-[280px]">{slide.description}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots + Button */}
        <div className="px-8 pb-12">
          <div className="flex justify-center gap-2 mb-8">
            {slides.map((_, i) => (
              <motion.div
                key={i}
                className={`h-1.5 rounded-full ${i === current ? "bg-primary" : "bg-border"}`}
                animate={{ width: i === current ? 24 : 8 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            ))}
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={next}
            className="w-full gradient-primary text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
          >
            {current === slides.length - 1 ? "Começar" : "Próximo"}
            <ChevronRight size={18} />
          </motion.button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default WelcomeScreen;

import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, Square, Pause, Play, ArrowLeft, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/app/MobileLayout";
import BottomNav from "@/components/app/BottomNav";

const RecorderScreen = () => {
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [time, setTime] = useState(0);
  const navigate = useNavigate();

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const toggleRecording = () => {
    if (!recording) {
      setRecording(true);
      setPaused(false);
      setTime(0);
    } else {
      setRecording(false);
      setPaused(false);
    }
  };

  return (
    <MobileLayout>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <button onClick={() => navigate("/app")} className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-lg font-bold text-foreground">Gravar Aula</h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-8 pb-24">
          {/* Waveform visual */}
          <div className="flex items-center gap-0.5 mb-8 h-16">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className={`w-1 rounded-full ${recording && !paused ? "bg-primary" : "bg-border"}`}
                animate={{
                  height: recording && !paused
                    ? [8, Math.random() * 50 + 10, 8]
                    : 8,
                }}
                transition={{
                  duration: 0.6,
                  repeat: recording && !paused ? Infinity : 0,
                  delay: i * 0.05,
                }}
              />
            ))}
          </div>

          {/* Timer */}
          <p className="text-5xl font-bold text-foreground mb-2 font-mono">{formatTime(time)}</p>
          <p className="text-sm text-muted-foreground mb-10">
            {recording ? (paused ? "Pausado" : "Gravando...") : "Pronto para gravar"}
          </p>

          {/* Controls */}
          <div className="flex items-center gap-6">
            {recording && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setPaused(!paused)}
                className="w-14 h-14 rounded-full bg-muted flex items-center justify-center"
              >
                {paused ? <Play size={22} className="text-foreground" /> : <Pause size={22} className="text-foreground" />}
              </motion.button>
            )}

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleRecording}
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl ${
                recording ? "bg-destructive shadow-destructive/30" : "gradient-primary shadow-primary/30"
              }`}
            >
              {recording ? (
                <Square size={28} className="text-white" fill="white" />
              ) : (
                <Mic size={32} className="text-white" />
              )}
            </motion.button>

            {recording && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileTap={{ scale: 0.9 }}
                className="w-14 h-14 rounded-full bg-muted flex items-center justify-center"
              >
                <FileText size={22} className="text-foreground" />
              </motion.button>
            )}
          </div>

          {!recording && (
            <div className="mt-12 w-full space-y-3">
              <h3 className="text-sm font-semibold text-foreground mb-2">Gravações Recentes</h3>
              {["Aula de Cálculo II", "Química Orgânica", "Hist. do Brasil"].map((t, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                    <Mic size={16} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{t}</p>
                    <p className="text-xs text-muted-foreground">45:30 · Há {i + 1} dias</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <BottomNav />
      </div>
    </MobileLayout>
  );
};

export default RecorderScreen;

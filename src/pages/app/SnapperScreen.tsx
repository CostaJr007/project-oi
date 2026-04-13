import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Image, ArrowLeft, Sparkles, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/app/MobileLayout";
import BottomNav from "@/components/app/BottomNav";

const SnapperScreen = () => {
  const [captured, setCaptured] = useState(false);
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <button onClick={() => navigate("/app")} className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-lg font-bold text-foreground">Problem Snapper</h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
          {!captured ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full text-center">
              {/* Camera area */}
              <div className="w-full aspect-[3/4] max-h-[380px] rounded-3xl bg-muted border-2 border-dashed border-border flex flex-col items-center justify-center mb-6">
                <div className="w-20 h-20 rounded-2xl bg-primary-50 flex items-center justify-center mb-4">
                  <Camera size={36} className="text-primary" />
                </div>
                <p className="text-sm font-semibold text-foreground mb-1">Fotografe a questão</p>
                <p className="text-xs text-muted-foreground max-w-[200px]">Aponte a câmera para qualquer problema ou exercício</p>
              </div>

              <div className="flex gap-3">
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setCaptured(true)}
                  className="flex-1 gradient-primary text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/25">
                  <Camera size={18} /> Tirar Foto
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }}
                  className="py-3.5 px-4 rounded-xl border border-border bg-card flex items-center justify-center">
                  <Image size={18} className="text-foreground" />
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
              {/* Simulated result */}
              <div className="w-full aspect-video rounded-2xl bg-muted mb-4 flex items-center justify-center border border-border">
                <p className="text-sm text-muted-foreground">📷 Imagem capturada</p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={18} className="text-primary" />
                  <h3 className="font-bold text-foreground">Solução IA</h3>
                </div>
                <div className="space-y-2 text-sm text-foreground">
                  <p className="font-semibold">Passo 1: Identificar</p>
                  <p className="text-muted-foreground">A questão envolve cálculo diferencial...</p>
                  <p className="font-semibold mt-3">Passo 2: Resolver</p>
                  <p className="text-muted-foreground">Aplicando a regra da cadeia...</p>
                  <p className="font-semibold mt-3">Resposta:</p>
                  <p className="text-primary font-bold">f'(x) = 6x² + 4x - 3</p>
                </div>
              </div>

              <motion.button whileTap={{ scale: 0.97 }} onClick={() => setCaptured(false)}
                className="w-full mt-4 py-3.5 rounded-xl border border-border bg-card text-foreground font-semibold flex items-center justify-center gap-2">
                <Camera size={18} /> Nova Foto
              </motion.button>
            </motion.div>
          )}
        </div>

        <BottomNav />
      </div>
    </MobileLayout>
  );
};

export default SnapperScreen;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react";
import MobileLayout from "@/components/app/MobileLayout";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabel = ["", "Fraca", "Média", "Forte"];
  const strengthColor = ["", "bg-destructive", "bg-accent", "bg-secondary"];

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen bg-background">
        <div className="px-4 pt-4">
          <button onClick={() => navigate("/login")} className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <ArrowLeft size={20} className="text-foreground" />
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 px-6 pt-6">
          <h1 className="text-2xl font-bold text-foreground">Criar Conta</h1>
          <p className="text-muted-foreground text-sm mt-1 mb-6">Comece sua jornada de estudos com IA</p>

          <form onSubmit={(e) => { e.preventDefault(); navigate("/app"); }} className="space-y-4">
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="Nome completo" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm" />
            </div>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm" />
            </div>
            <div>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type={showPass ? "text" : "password"} placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength ? strengthColor[strength] : "bg-border"} transition-colors`} />
                    ))}
                  </div>
                  <span className={`text-xs font-medium ${strength === 3 ? "text-secondary" : strength === 2 ? "text-accent" : "text-destructive"}`}>
                    {strengthLabel[strength]}
                  </span>
                </div>
              )}
            </div>

            <label className="flex items-start gap-2 text-sm text-muted-foreground cursor-pointer">
              <input type="checkbox" className="w-4 h-4 mt-0.5 rounded border-border accent-primary" />
              <span>Concordo com os <button type="button" className="text-primary font-semibold">Termos de Uso</button> e <button type="button" className="text-primary font-semibold">Política de Privacidade</button></span>
            </label>

            <motion.button whileTap={{ scale: 0.97 }} type="submit"
              className="w-full gradient-primary text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-primary/25">
              Criar Conta
            </motion.button>
          </form>

          <div className="text-center mt-6 pb-8">
            <span className="text-sm text-muted-foreground">
              Já tem conta?{" "}
              <button onClick={() => navigate("/login")} className="text-primary font-semibold">Entrar</button>
            </span>
          </div>
        </motion.div>
      </div>
    </MobileLayout>
  );
};

export default RegisterScreen;

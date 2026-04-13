import { motion } from "framer-motion";
import { User, Bell, Moon, Globe, Shield, HelpCircle, LogOut, ChevronRight, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/app/MobileLayout";
import MobileHeader from "@/components/app/MobileHeader";

const sections = [
  {
    title: "Conta",
    items: [
      { icon: User, label: "Perfil", desc: "Editar informações" },
      { icon: Bell, label: "Notificações", desc: "Gerenciar alertas" },
      { icon: Shield, label: "Privacidade", desc: "Dados e segurança" },
    ],
  },
  {
    title: "Preferências",
    items: [
      { icon: Moon, label: "Tema Escuro", desc: "Aparência do app", toggle: true },
      { icon: Globe, label: "Idioma", desc: "Português (BR)" },
    ],
  },
  {
    title: "Suporte",
    items: [
      { icon: HelpCircle, label: "Ajuda", desc: "FAQ e suporte" },
    ],
  },
];

const SettingsScreen = () => {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="flex flex-col h-screen">
        <MobileHeader title="Configurações" onBack={() => navigate("/app")} />

        <div className="flex-1 overflow-y-auto px-4 pb-24">
          {/* Premium Banner */}
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="gradient-ai rounded-2xl p-5 my-4 relative overflow-hidden"
          >
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-primary-foreground/10" />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                <Crown size={24} className="text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="text-primary-foreground font-bold">StudyFlow Premium</h3>
                <p className="text-primary-foreground/70 text-xs">Desbloqueie todas as funcionalidades</p>
              </div>
              <ChevronRight size={20} className="text-primary-foreground/60" />
            </div>
          </motion.div>

          {/* Profile Card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border mb-5">
            <div className="w-14 h-14 rounded-full gradient-ai flex items-center justify-center">
              <span className="text-primary-foreground text-xl font-bold">E</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-foreground">Estudante</p>
              <p className="text-sm text-muted-foreground">estudante@email.com</p>
            </div>
          </div>

          {/* Settings Sections */}
          {sections.map((section, si) => (
            <div key={si} className="mb-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">{section.title}</h3>
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                {section.items.map((item, ii) => (
                  <button
                    key={ii}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-muted/50 transition-colors ${
                      ii < section.items.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <item.icon size={18} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    {item.toggle ? (
                      <div className="w-10 h-6 rounded-full bg-primary relative">
                        <div className="absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-primary-foreground shadow-sm" />
                      </div>
                    ) : (
                      <ChevronRight size={16} className="text-muted-foreground" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Logout */}
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-destructive/20 text-destructive font-semibold mb-6 active:scale-[0.98] transition-transform"
          >
            <LogOut size={18} /> Sair
          </button>

          <p className="text-center text-xs text-muted-foreground mb-4">StudyFlow v1.0.0</p>
        </div>
      </div>
    </MobileLayout>
  );
};

export default SettingsScreen;

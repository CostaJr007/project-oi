import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Copy, Check, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/app/MobileLayout";
import BottomNav from "@/components/app/BottomNav";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  time: string;
}

const suggestions = [
  "Explique derivadas parciais",
  "Resuma a 2ª Guerra Mundial",
  "O que é machine learning?",
  "Ajude com redação ENEM",
];

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = { id: Date.now(), text, isUser: true, time: now };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      const aiMsg: Message = {
        id: Date.now() + 1,
        text: `Ótima pergunta! Vou te explicar sobre "${text.slice(0, 40)}...".\n\nEssa é uma demonstração da interface do GenioIA. Em uma versão completa, aqui você receberia uma resposta detalhada e personalizada da IA. 🧠`,
        isUser: false,
        time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1500);
  };

  const copyMsg = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <MobileLayout>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border glass">
          <button onClick={() => navigate("/app")} className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
            <ArrowLeft size={18} />
          </button>
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Tutor IA</h2>
            <p className="text-xs text-secondary">Online</p>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 pb-32">
          {messages.length === 0 && !typing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-4">
                <Sparkles size={28} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">Como posso ajudar?</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-[250px]">Pergunte qualquer coisa sobre seus estudos</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestions.map((s, i) => (
                  <motion.button
                    key={i}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => sendMessage(s)}
                    className="px-3 py-2 rounded-xl bg-primary-50 text-primary text-xs font-medium border border-primary/10"
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex mb-3 ${msg.isUser ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] relative group ${msg.isUser ? "gradient-primary text-white rounded-2xl rounded-br-md" : "bg-card border border-border text-foreground rounded-2xl rounded-bl-md"} px-4 py-3`}>
                  <p className="text-sm whitespace-pre-line">{msg.text}</p>
                  <div className={`flex items-center gap-2 mt-1.5 ${msg.isUser ? "justify-end" : "justify-between"}`}>
                    <span className={`text-[10px] ${msg.isUser ? "text-white/60" : "text-muted-foreground"}`}>{msg.time}</span>
                    {!msg.isUser && (
                      <button onClick={() => copyMsg(msg.id, msg.text)} className="text-muted-foreground hover:text-foreground">
                        {copied === msg.id ? <Check size={12} className="text-secondary" /> : <Copy size={12} />}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {typing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-muted-foreground">
              <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                <span className="text-xs">Pensando</span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-dot" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-dot [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-dot [animation-delay:0.4s]" />
              </div>
            </motion.div>
          )}
        </div>

        {/* Input */}
        <div className="absolute bottom-16 left-0 right-0 px-4 pb-2 pt-2 glass border-t border-border">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="Digite sua pergunta..."
              className="flex-1 py-3 px-4 rounded-xl bg-muted border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center disabled:opacity-40 shadow-lg shadow-primary/20"
            >
              <Send size={18} className="text-white" />
            </motion.button>
          </div>
        </div>

        <BottomNav />
      </div>
    </MobileLayout>
  );
};

export default ChatScreen;

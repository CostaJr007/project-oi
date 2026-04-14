import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Folder {
  id: string;
  name: string;
  icon: string;
  color: string;
  flashcardsCount: number;
  quizScore: number;
  notesCount: number;
  createdAt: Date;
}

export interface Flashcard {
  id: string;
  folderId: string;
  subtopic: string;
  front: string;
  back: string;
  type: "front-back" | "multiple-choice" | "fill-blank";
  difficulty: "easy" | "medium" | "hard";
  interval: number;
  easeFactor: number;
  dueDate: Date;
  reviewCount: number;
}

export interface Note {
  id: string;
  folderId: string;
  title: string;
  content: string;
  source: "youtube" | "transcription" | "manual";
  sourceUrl?: string;
  createdAt: Date;
}

export interface QuizResult {
  id: string;
  folderId: string;
  score: number;
  total: number;
  date: Date;
  weakAreas: string[];
}

interface StudyContextType {
  folders: Folder[];
  selectedFolderId: string | null;
  selectedFolder: Folder | null;
  flashcards: Flashcard[];
  notes: Note[];
  quizResults: QuizResult[];
  darkMode: boolean;
  sidebarOpen: boolean;
  activeTab: string;
  addFolder: (name: string) => void;
  renameFolder: (id: string, name: string) => void;
  removeFolder: (id: string) => void;
  selectFolder: (id: string | null) => void;
  addFlashcards: (folderId: string, cards: Omit<Flashcard, "id" | "folderId" | "interval" | "easeFactor" | "dueDate" | "reviewCount">[]) => void;
  addNote: (note: Omit<Note, "id" | "createdAt">) => void;
  addQuizResult: (result: Omit<QuizResult, "id" | "date">) => void;
  toggleDarkMode: () => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
}

const StudyContext = createContext<StudyContextType | null>(null);

const defaultFolders: Folder[] = [
  { id: "1", name: "Cálculo II", icon: "📐", color: "from-blue-500 to-cyan-500", flashcardsCount: 24, quizScore: 78, notesCount: 5, createdAt: new Date() },
  { id: "2", name: "Física Quântica", icon: "⚛️", color: "from-purple-500 to-pink-500", flashcardsCount: 18, quizScore: 65, notesCount: 3, createdAt: new Date() },
  { id: "3", name: "História do Brasil", icon: "🇧🇷", color: "from-green-500 to-emerald-500", flashcardsCount: 32, quizScore: 91, notesCount: 8, createdAt: new Date() },
  { id: "4", name: "Programação Web", icon: "💻", color: "from-orange-500 to-amber-500", flashcardsCount: 15, quizScore: 85, notesCount: 4, createdAt: new Date() },
];

const defaultFlashcards: Flashcard[] = [
  { id: "f1", folderId: "1", subtopic: "Derivadas", front: "O que é uma derivada?", back: "A derivada mede a taxa de variação instantânea de uma função.", type: "front-back", difficulty: "medium", interval: 1, easeFactor: 2.5, dueDate: new Date(), reviewCount: 0 },
  { id: "f2", folderId: "1", subtopic: "Integrais", front: "Integral de 2x dx", back: "x² + C", type: "front-back", difficulty: "easy", interval: 1, easeFactor: 2.5, dueDate: new Date(), reviewCount: 0 },
  { id: "f3", folderId: "1", subtopic: "Integrais", front: "Teorema Fundamental do Cálculo", back: "Se F é uma antiderivada de f em [a,b], então ∫ₐᵇ f(x)dx = F(b) - F(a)", type: "front-back", difficulty: "hard", interval: 1, easeFactor: 2.5, dueDate: new Date(), reviewCount: 0 },
  { id: "f4", folderId: "2", subtopic: "Princípios Fundamentais", front: "O que é o princípio da incerteza?", back: "Não se pode medir simultaneamente posição e momento de uma partícula com precisão arbitrária.", type: "front-back", difficulty: "medium", interval: 1, easeFactor: 2.5, dueDate: new Date(), reviewCount: 0 },
  { id: "f5", folderId: "3", subtopic: "Descobrimento", front: "Em que ano o Brasil foi descoberto?", back: "1500, por Pedro Álvares Cabral", type: "front-back", difficulty: "easy", interval: 1, easeFactor: 2.5, dueDate: new Date(), reviewCount: 0 },
  { id: "f6", folderId: "1", subtopic: "Derivadas", front: "Regra da cadeia", back: "(f∘g)'(x) = f'(g(x)) · g'(x)", type: "front-back", difficulty: "hard", interval: 1, easeFactor: 2.5, dueDate: new Date(), reviewCount: 0 },
  { id: "f7", folderId: "1", subtopic: "Limites", front: "O que é um limite?", back: "O valor que uma função se aproxima quando x tende a um certo ponto.", type: "front-back", difficulty: "easy", interval: 1, easeFactor: 2.5, dueDate: new Date(), reviewCount: 0 },
  { id: "f8", folderId: "2", subtopic: "Modelo Atômico", front: "O que é o modelo de Bohr?", back: "Modelo que descreve elétrons orbitando o núcleo em níveis de energia quantizados.", type: "front-back", difficulty: "medium", interval: 1, easeFactor: 2.5, dueDate: new Date(), reviewCount: 0 },
  { id: "f9", folderId: "2", subtopic: "Princípios Fundamentais", front: "Dualidade onda-partícula", back: "Toda matéria exibe propriedades de onda e partícula simultaneamente.", type: "front-back", difficulty: "hard", interval: 1, easeFactor: 2.5, dueDate: new Date(), reviewCount: 0 },
];

const defaultNotes: Note[] = [
  { id: "n1", folderId: "1", title: "Resumo: Regras de Derivação", content: "• Regra da potência: d/dx[xⁿ] = nxⁿ⁻¹\n• Regra do produto: (fg)' = f'g + fg'\n• Regra da cadeia: (f∘g)' = f'(g(x))·g'(x)", source: "manual", createdAt: new Date() },
];

export function StudyProvider({ children }: { children: ReactNode }) {
  const [folders, setFolders] = useState<Folder[]>(defaultFolders);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>(defaultFlashcards);
  const [notes, setNotes] = useState<Note[]>(defaultNotes);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("flashcards");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const selectedFolder = folders.find((f) => f.id === selectedFolderId) || null;

  const addFolder = (name: string) => {
    const emojis = ["📚", "🧪", "🔬", "📊", "🎯", "🧠", "🎨", "🌍"];
    const colors = ["from-blue-500 to-cyan-500", "from-purple-500 to-pink-500", "from-green-500 to-emerald-500", "from-orange-500 to-amber-500", "from-red-500 to-rose-500"];
    const newFolder: Folder = {
      id: Date.now().toString(),
      name,
      icon: emojis[Math.floor(Math.random() * emojis.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      flashcardsCount: 0,
      quizScore: 0,
      notesCount: 0,
      createdAt: new Date(),
    };
    setFolders((prev) => [...prev, newFolder]);
  };

  const removeFolder = (id: string) => {
    setFolders((prev) => prev.filter((f) => f.id !== id));
    if (selectedFolderId === id) setSelectedFolderId(null);
  };

  const renameFolder = (id: string, name: string) => {
    setFolders((prev) => prev.map((f) => f.id === id ? { ...f, name } : f));
  };

  const selectFolder = (id: string | null) => {
    setSelectedFolderId(id);
    if (id) setActiveTab("flashcards");
  };

  const addFlashcards = (folderId: string, cards: Omit<Flashcard, "id" | "folderId" | "interval" | "easeFactor" | "dueDate" | "reviewCount">[]) => {
    const newCards = cards.map((c, i) => ({
      ...c,
      id: `${Date.now()}-${i}`,
      folderId,
      interval: 1,
      easeFactor: 2.5,
      dueDate: new Date(),
      reviewCount: 0,
    }));
    setFlashcards((prev) => [...prev, ...newCards]);
    setFolders((prev) => prev.map((f) => f.id === folderId ? { ...f, flashcardsCount: f.flashcardsCount + cards.length } : f));
  };

  const addNote = (note: Omit<Note, "id" | "createdAt">) => {
    setNotes((prev) => [...prev, { ...note, id: Date.now().toString(), createdAt: new Date() }]);
    setFolders((prev) => prev.map((f) => f.id === note.folderId ? { ...f, notesCount: f.notesCount + 1 } : f));
  };

  const addQuizResult = (result: Omit<QuizResult, "id" | "date">) => {
    setQuizResults((prev) => [...prev, { ...result, id: Date.now().toString(), date: new Date() }]);
    setFolders((prev) => prev.map((f) => f.id === result.folderId ? { ...f, quizScore: Math.round((result.score / result.total) * 100) } : f));
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <StudyContext.Provider value={{
      folders, selectedFolderId, selectedFolder, flashcards, notes, quizResults,
      darkMode, sidebarOpen, activeTab,
      addFolder, renameFolder, removeFolder, selectFolder, addFlashcards, addNote, addQuizResult,
      toggleDarkMode, setSidebarOpen, setActiveTab,
    }}>
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const ctx = useContext(StudyContext);
  if (!ctx) throw new Error("useStudy must be used within StudyProvider");
  return ctx;
}

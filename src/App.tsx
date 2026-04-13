import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import WelcomeScreen from "./pages/onboarding/WelcomeScreen";
import LoginScreen from "./pages/auth/LoginScreen";
import RegisterScreen from "./pages/auth/RegisterScreen";
import Dashboard from "./pages/app/Dashboard";
import ChatScreen from "./pages/app/ChatScreen";
import StudyScreen from "./pages/app/StudyScreen";
import QuizScreen from "./pages/app/QuizScreen";
import RecorderScreen from "./pages/app/RecorderScreen";
import SnapperScreen from "./pages/app/SnapperScreen";
import SettingsScreen from "./pages/app/SettingsScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/app" element={<Dashboard />} />
          <Route path="/app/chat" element={<ChatScreen />} />
          <Route path="/app/study" element={<StudyScreen />} />
          <Route path="/app/quiz" element={<QuizScreen />} />
          <Route path="/app/recorder" element={<RecorderScreen />} />
          <Route path="/app/snapper" element={<SnapperScreen />} />
          <Route path="/app/settings" element={<SettingsScreen />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

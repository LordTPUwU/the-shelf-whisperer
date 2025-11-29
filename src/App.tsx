import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ObrasProvider, useObras } from "./contexts/ObrasContext";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Biblioteca from "./pages/Biblioteca";
import Explorar from "./pages/Explorar";
import Afinidades from "./pages/Afinidades";
import Estatisticas from "./pages/Estatisticas";
import Perfil from "./pages/Perfil";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { estaAutenticado } = useObras();
  return estaAutenticado ? <>{children}</> : <Navigate to="/auth" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/biblioteca" element={<ProtectedRoute><Biblioteca /></ProtectedRoute>} />
      <Route path="/explorar" element={<ProtectedRoute><Explorar /></ProtectedRoute>} />
      <Route path="/afinidades" element={<ProtectedRoute><Afinidades /></ProtectedRoute>} />
      <Route path="/estatisticas" element={<ProtectedRoute><Estatisticas /></ProtectedRoute>} />
      <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ObrasProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ObrasProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

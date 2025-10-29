import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ObrasProvider } from "./contexts/ObrasContext";
import Home from "./pages/Home";
import Biblioteca from "./pages/Biblioteca";
import Explorar from "./pages/Explorar";
import Afinidades from "./pages/Afinidades";
import Estatisticas from "./pages/Estatisticas";
import Perfil from "./pages/Perfil";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ObrasProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/biblioteca" element={<Biblioteca />} />
            <Route path="/explorar" element={<Explorar />} />
            <Route path="/afinidades" element={<Afinidades />} />
            <Route path="/estatisticas" element={<Estatisticas />} />
            <Route path="/perfil" element={<Perfil />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ObrasProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

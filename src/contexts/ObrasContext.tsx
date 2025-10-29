import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Obra, Usuario } from "@/types/obra";

interface ObrasContextType {
  usuario: Usuario;
  obras: Obra[];
  adicionarObra: (obra: Omit<Obra, "id" | "dataCriacao">) => void;
  editarObra: (id: string, obra: Partial<Obra>) => void;
  removerObra: (id: string) => void;
  toggleCurtida: (id: string) => void;
  toggleDesejos: (id: string) => void;
  atualizarPerfil: (dados: Partial<Usuario>) => void;
  limparDados: () => void;
}

const ObrasContext = createContext<ObrasContextType | undefined>(undefined);

const STORAGE_KEY = "myshelf_data";

const usuarioPadrao: Usuario = {
  id: "user-1",
  nome: "Leitor Apaixonado",
  email: "leitor@myshelf.com",
  bio: "Amante de boas histórias e descobertas culturais! 📚✨",
  obras: [],
};

export const ObrasProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return usuarioPadrao;
      }
    }
    return usuarioPadrao;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
  }, [usuario]);

  const adicionarObra = (obraData: Omit<Obra, "id" | "dataCriacao">) => {
    const novaObra: Obra = {
      ...obraData,
      id: `obra-${Date.now()}`,
      dataCriacao: new Date().toISOString(),
    };
    setUsuario((prev) => ({
      ...prev,
      obras: [...prev.obras, novaObra],
    }));
  };

  const editarObra = (id: string, obraData: Partial<Obra>) => {
    setUsuario((prev) => ({
      ...prev,
      obras: prev.obras.map((obra) =>
        obra.id === id ? { ...obra, ...obraData } : obra
      ),
    }));
  };

  const removerObra = (id: string) => {
    setUsuario((prev) => ({
      ...prev,
      obras: prev.obras.filter((obra) => obra.id !== id),
    }));
  };

  const toggleCurtida = (id: string) => {
    setUsuario((prev) => ({
      ...prev,
      obras: prev.obras.map((obra) =>
        obra.id === id ? { ...obra, curtida: !obra.curtida } : obra
      ),
    }));
  };

  const toggleDesejos = (id: string) => {
    setUsuario((prev) => ({
      ...prev,
      obras: prev.obras.map((obra) =>
        obra.id === id ? { ...obra, desejos: !obra.desejos } : obra
      ),
    }));
  };

  const atualizarPerfil = (dados: Partial<Usuario>) => {
    setUsuario((prev) => ({ ...prev, ...dados }));
  };

  const limparDados = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUsuario(usuarioPadrao);
  };

  return (
    <ObrasContext.Provider
      value={{
        usuario,
        obras: usuario.obras,
        adicionarObra,
        editarObra,
        removerObra,
        toggleCurtida,
        toggleDesejos,
        atualizarPerfil,
        limparDados,
      }}
    >
      {children}
    </ObrasContext.Provider>
  );
};

export const useObras = () => {
  const context = useContext(ObrasContext);
  if (!context) {
    throw new Error("useObras deve ser usado dentro de ObrasProvider");
  }
  return context;
};

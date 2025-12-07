import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Obra, Usuario } from "@/types/obra";

interface ObrasContextType {
  usuario: Usuario;
  obras: Obra[];
  estaAutenticado: boolean;
  adicionarObra: (obra: Omit<Obra, "id" | "dataCriacao">) => void;
  editarObra: (id: string, obra: Partial<Obra>) => void;
  removerObra: (id: string) => void;
  toggleCurtida: (id: string) => void;
  toggleDesejos: (id: string) => void;
  atualizarPerfil: (dados: Partial<Usuario>) => void;
  limparDados: () => void;
  login: (email: string, senha: string) => boolean;
  registrar: (nome: string, email: string, senha: string) => boolean;
  logout: () => void;
}

const ObrasContext = createContext<ObrasContextType | undefined>(undefined);

const STORAGE_KEY = "myshelf_data";
const AUTH_KEY = "myshelf_auth";
const USERS_KEY = "myshelf_users";

interface UsuarioAuth extends Usuario {
  senha: string;
}

export const ObrasProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const authData = localStorage.getItem(AUTH_KEY);
    if (authData) {
      const { email } = JSON.parse(authData);
      const usersData = localStorage.getItem(USERS_KEY);
      if (usersData) {
        const users: UsuarioAuth[] = JSON.parse(usersData);
        const user = users.find(u => u.email === email);
        if (user) {
          const { senha, ...userData } = user;
          return userData;
        }
      }
    }
    return null;
  });

  const [estaAutenticado, setEstaAutenticado] = useState<boolean>(() => {
    return !!localStorage.getItem(AUTH_KEY);
  });

  useEffect(() => {
    if (usuario && estaAutenticado) {
      const usersData = localStorage.getItem(USERS_KEY);
      if (usersData) {
        const users: UsuarioAuth[] = JSON.parse(usersData);
        const userIndex = users.findIndex(u => u.id === usuario.id);
        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], ...usuario };
          localStorage.setItem(USERS_KEY, JSON.stringify(users));
        }
      }
    }
  }, [usuario, estaAutenticado]);

  const adicionarObra = (obraData: Omit<Obra, "id" | "dataCriacao">) => {
    // Verificar se obra já existe (pelo apiId e tipo)
    if (obraData.apiId && usuario?.obras.some(o => o.apiId === obraData.apiId && o.tipo === obraData.tipo)) {
      return; // Não adicionar duplicata
    }
    
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
    if (usuario) {
      setUsuario((prev) => prev ? { ...prev, obras: [] } : null);
    }
  };

  const login = (email: string, senha: string): boolean => {
    const usersData = localStorage.getItem(USERS_KEY);
    if (!usersData) return false;

    const users: UsuarioAuth[] = JSON.parse(usersData);
    const user = users.find(u => u.email === email && u.senha === senha);

    if (user) {
      const { senha: _, ...userData } = user;
      setUsuario(userData);
      setEstaAutenticado(true);
      localStorage.setItem(AUTH_KEY, JSON.stringify({ email }));
      return true;
    }
    return false;
  };

  const registrar = (nome: string, email: string, senha: string): boolean => {
    const usersData = localStorage.getItem(USERS_KEY);
    const users: UsuarioAuth[] = usersData ? JSON.parse(usersData) : [];

    if (users.some(u => u.email === email)) {
      return false;
    }

    const novoUsuario: UsuarioAuth = {
      id: `user-${Date.now()}`,
      nome,
      email,
      senha,
      bio: "Amante de boas histórias e descobertas culturais! 📚✨",
      obras: [],
    };

    users.push(novoUsuario);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const { senha: _, ...userData } = novoUsuario;
    setUsuario(userData);
    setEstaAutenticado(true);
    localStorage.setItem(AUTH_KEY, JSON.stringify({ email }));
    return true;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setUsuario(null);
    setEstaAutenticado(false);
  };

  return (
    <ObrasContext.Provider
      value={{
        usuario: usuario!,
        obras: usuario?.obras || [],
        estaAutenticado,
        adicionarObra,
        editarObra,
        removerObra,
        toggleCurtida,
        toggleDesejos,
        atualizarPerfil,
        limparDados,
        login,
        registrar,
        logout,
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

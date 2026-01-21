import { useEffect, useRef, useCallback } from 'react';
import { TipoObra } from "@/types/obra";

// Dados das obras (do seu app.js)
export const obrasDisponiveis = [
  {
    id: 1,
    titulo: "Inception",
    tipo: "filme",
    descricao: "Um ladrão especializado em extrair segredos dos sonhos das pessoas recebe uma última missão: implantar uma ideia na mente de alguém.",
    imagem: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Ber.jpg",
    ano: 2010,
    avaliacao: 8.8
  },
  {
    id: 2,
    titulo: "Breaking Bad",
    tipo: "serie",
    descricao: "Um professor de química do ensino médio diagnosticado com câncer se junta a um ex-aluno para fabricar e vender metanfetamina.",
    imagem: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    ano: 2008,
    avaliacao: 9.5
  },
  {
    id: 4,
    titulo: "The Dark Knight",
    tipo: "filme",
    descricao: "Batman enfrenta o Coringa, um gênio criminoso que mergulha Gotham City no caos e força o herói a questionar tudo em que acredita.",
    imagem: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    ano: 2008,
    avaliacao: 9.0
  },
  {
    id: 5,
    titulo: "Stranger Things",
    tipo: "serie",
    descricao: "Quando um garoto desaparece, uma pequena cidade descobre segredos envolvendo experimentos secretos, forças sobrenaturais e uma garota estranha.",
    imagem: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    ano: 2016,
    avaliacao: 8.7
  },
  {
    id: 7,
    titulo: "Interstellar",
    tipo: "filme",
    descricao: "Uma equipe de exploradores viaja através de um buraco de minhoca no espaço em busca de um novo lar para a humanidade.",
    imagem: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    ano: 2014,
    avaliacao: 8.6
  },
  {
    id: 8,
    titulo: "Game of Thrones",
    tipo: "serie",
    descricao: "Nove famílias nobres lutam pelo controle do mítico reino de Westeros enquanto uma antiga ameaça ressurge após milênios.",
    imagem: "https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg",
    ano: 2011,
    avaliacao: 9.3
  }
];

interface Obra {
  id: number;
  titulo: string;
  tipo: TipoObra;
  descricao: string;
  imagem: string;
  ano: number;
  avaliacao: number;
  dataAdicao?: string;
}

interface JavaScriptObrasRendererProps {
  obrasUsuario: { apiId?: string; tipo: TipoObra }[];
  tipoAtivo: 'filme' | 'serie' | 'livro';
  onAdicionar: (obra: any, comCurtida?: boolean) => void;
  busca?: string;
}

export const JavaScriptObrasRenderer: React.FC<JavaScriptObrasRendererProps> = ({
  obrasUsuario,
  tipoAtivo,
  onAdicionar,
  busca = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bibliotecaContainerRef = useRef<HTMLDivElement>(null);
  const bibliotecaCountRef = useRef<HTMLSpanElement>(null);
  const bibliotecaEmptyRef = useRef<HTMLParagraphElement>(null);
  
  // Estado local para biblioteca do usuário (apenas filmes/séries)
  const bibliotecaUsuarioRef = useRef<Obra[]>([]);
  const filtroAtualRef = useRef<'todos' | 'filme' | 'serie'>(tipoAtivo === 'filme' ? 'filme' : 'serie');
  const termoBuscaAtualRef = useRef<string>(busca);

  // ============================================
  // FUNÇÕES DE CRIAÇÃO DE ELEMENTOS (JavaScript Puro)
  // ============================================

  const criarImagemCard = (src: string, alt: string): HTMLImageElement => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.className = "obra-card__imagem";
    
    img.onerror = () => {
      img.src = "https://via.placeholder.com/280x180?text=Sem+Imagem";
    };
    
    return img;
  };

  const criarBadgeTipo = (tipo: string): HTMLSpanElement => {
    const badge = document.createElement("span");
    badge.className = `obra-card__tipo obra-card__tipo--${tipo}`;
    
    const tiposTexto: Record<string, string> = {
      filme: "🎬 Filme",
      serie: "📺 Série",
      livro: "📖 Livro"
    };
    
    badge.textContent = tiposTexto[tipo] || tipo;
    return badge;
  };

  const criarTituloCard = (titulo: string): HTMLHeadingElement => {
    const h3 = document.createElement("h3");
    h3.className = "obra-card__titulo";
    h3.textContent = titulo;
    return h3;
  };

  const criarDescricaoCard = (descricao: string): HTMLParagraphElement => {
    const p = document.createElement("p");
    p.className = "obra-card__descricao";
    p.textContent = descricao;
    return p;
  };

  const criarInfoCard = (ano: number, avaliacao: number): HTMLDivElement => {
    const div = document.createElement("div");
    div.className = "obra-card__info";
    
    const spanAno = document.createElement("span");
    spanAno.textContent = `📅 ${ano}`;
    
    const spanAvaliacao = document.createElement("span");
    spanAvaliacao.textContent = `⭐ ${avaliacao}/10`;
    
    div.appendChild(spanAno);
    div.appendChild(spanAvaliacao);
    
    return div;
  };

  const criarBotaoAdicionar = (obra: Obra, jaAdicionada: boolean): HTMLButtonElement => {
    const button = document.createElement("button");
    button.className = "btn btn-adicionar";
    button.disabled = jaAdicionada;
    
    if (jaAdicionada) {
      button.textContent = "✓ Na Biblioteca";
    } else {
      button.textContent = "+ Adicionar";
      
      button.addEventListener("click", () => {
        // Chama a função React para adicionar
        onAdicionar({
          id: obra.id.toString(),
          apiId: obra.id.toString(),
          title: obra.titulo,
          type: obra.tipo,
          description: obra.descricao,
          image: obra.imagem,
          releaseDate: obra.ano.toString(),
          rating: obra.avaliacao
        });
        
        // Atualiza a biblioteca local
        bibliotecaUsuarioRef.current.push({
          ...obra,
          dataAdicao: new Date().toISOString()
        });
        atualizarInterface();
      });
    }
    
    return button;
  };

  const criarBotaoRemover = (obra: Obra): HTMLButtonElement => {
    const button = document.createElement("button");
    button.className = "btn btn-remover";
    button.textContent = "🗑 Remover";
    
    button.addEventListener("click", () => {
      bibliotecaUsuarioRef.current = bibliotecaUsuarioRef.current.filter(o => o.id !== obra.id);
      atualizarInterface();
    });
    
    return button;
  };

  const criarBotoesCard = (obra: Obra, modoBiblioteca = false): HTMLDivElement => {
    const div = document.createElement("div");
    div.className = "obra-card__botoes";
    
    if (modoBiblioteca) {
      div.appendChild(criarBotaoRemover(obra));
    } else {
      const jaAdicionada = obrasUsuario.some(o => o.apiId === obra.id.toString() && o.tipo === obra.tipo) ||
                          bibliotecaUsuarioRef.current.some(o => o.id === obra.id);
      div.appendChild(criarBotaoAdicionar(obra, jaAdicionada));
    }
    
    return div;
  };

  const criarCardObra = (obra: Obra, modoBiblioteca = false): HTMLDivElement => {
    const card = document.createElement("div");
    card.className = "obra-card";
    card.dataset.id = obra.id.toString();
    
    card.appendChild(criarImagemCard(obra.imagem, obra.titulo));
    card.appendChild(criarBadgeTipo(obra.tipo));
    card.appendChild(criarTituloCard(obra.titulo));
    card.appendChild(criarDescricaoCard(obra.descricao));
    card.appendChild(criarInfoCard(obra.ano, obra.avaliacao));
    card.appendChild(criarBotoesCard(obra, modoBiblioteca));
    
    return card;
  };

  // ============================================
  // FUNÇÕES DE RENDERIZAÇÃO
  // ============================================

  const renderizarListaExplorar = () => {
    if (!containerRef.current) return;
    
    containerRef.current.innerHTML = "";
    
    const obrasFiltradas = obrasDisponiveis.filter((obra) => {
      const matchTipo = filtroAtualRef.current === "todos" || obra.tipo === filtroAtualRef.current;
      const matchBusca = obra.titulo.toLowerCase().includes(termoBuscaAtualRef.current.toLowerCase());
      return matchTipo && matchBusca;
    });
    
    obrasFiltradas.forEach((obra) => {
      const card = criarCardObra(obra, false);
      containerRef.current?.appendChild(card);
    });
    
    if (obrasFiltradas.length === 0) {
      const mensagem = document.createElement("p");
      mensagem.className = "empty-message";
      mensagem.textContent = "Nenhuma obra encontrada com os filtros atuais.";
      containerRef.current?.appendChild(mensagem);
    }
  };

  const renderizarBiblioteca = () => {
    if (!bibliotecaContainerRef.current || !bibliotecaCountRef.current || !bibliotecaEmptyRef.current) return;
    
    bibliotecaContainerRef.current.innerHTML = "";
    bibliotecaCountRef.current.textContent = `(${bibliotecaUsuarioRef.current.length})`;
    
    if (bibliotecaUsuarioRef.current.length === 0) {
      bibliotecaEmptyRef.current.classList.remove("hidden");
    } else {
      bibliotecaEmptyRef.current.classList.add("hidden");
      
      bibliotecaUsuarioRef.current.forEach((obra) => {
        const card = criarCardObra(obra, true);
        bibliotecaContainerRef.current?.appendChild(card);
      });
    }
  };

  const atualizarInterface = () => {
    renderizarListaExplorar();
    renderizarBiblioteca();
  };

  // ============================================
  // CARREGAR DADOS SALVOS
  // ============================================

  const carregarDoLocalStorage = () => {
    const dados = localStorage.getItem("biblioteca_usuario_js");
    if (dados) {
      try {
        bibliotecaUsuarioRef.current = JSON.parse(dados);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }
  };

  const salvarNoLocalStorage = () => {
    localStorage.setItem("biblioteca_usuario_js", JSON.stringify(bibliotecaUsuarioRef.current));
  };

  // ============================================
  // EFFECTS
  // ============================================

  useEffect(() => {
    filtroAtualRef.current = tipoAtivo === 'filme' ? 'filme' : 'serie';
    termoBuscaAtualRef.current = busca;
    
    carregarDoLocalStorage();
    atualizarInterface();
    
    // Salva automaticamente quando o componente desmonta
    return () => {
      salvarNoLocalStorage();
    };
  }, [tipoAtivo, busca, obrasUsuario]);

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="javascript-puro-container">
      {/* Estilos do CSS original */}
      <style jsx>{`
        :root {
          --cor-fundo: #1a1625;
          --cor-fundo-card: #2d2640;
          --cor-primaria: #9b87f5;
          --cor-primaria-hover: #7c68d4;
          --cor-texto: #ffffff;
          --cor-texto-secundario: #a0a0a0;
          --cor-sucesso: #4ade80;
          --cor-perigo: #ef4444;
          --cor-borda: #3d3555;
          --sombra: 0 4px 20px rgba(0, 0, 0, 0.3);
          --border-radius: 12px;
        }

        .javascript-puro-container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: var(--cor-texto);
        }

        .obra-card {
          background-color: var(--cor-fundo-card);
          border-radius: var(--border-radius);
          padding: 1.5rem;
          box-shadow: var(--sombra);
          border: 1px solid var(--cor-borda);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
          animation: fadeIn 0.4s ease forwards;
        }

        .obra-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(155, 135, 245, 0.2);
        }

        .obra-card__imagem {
          width: 100%;
          height: 180px;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 1rem;
          background-color: var(--cor-borda);
        }

        .obra-card__tipo {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
        }

        .obra-card__tipo--filme {
          background-color: rgba(239, 68, 68, 0.2);
          color: #fca5a5;
        }

        .obra-card__tipo--serie {
          background-color: rgba(59, 130, 246, 0.2);
          color: #93c5fd;
        }

        .obra-card__titulo {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--cor-texto);
        }

        .obra-card__descricao {
          font-size: 0.875rem;
          color: var(--cor-texto-secundario);
          margin-bottom: 1rem;
          flex-grow: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .obra-card__info {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: var(--cor-texto-secundario);
          margin-bottom: 1rem;
        }

        .obra-card__botoes {
          display: flex;
          gap: 0.5rem;
        }

        .btn {
          flex: 1;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 600;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .btn-adicionar {
          background-color: var(--cor-primaria);
          color: white;
        }

        .btn-adicionar:hover {
          background-color: var(--cor-primaria-hover);
        }

        .btn-adicionar:disabled {
          background-color: var(--cor-borda);
          color: var(--cor-texto-secundario);
          cursor: not-allowed;
        }

        .btn-remover {
          background-color: transparent;
          border: 2px solid var(--cor-perigo);
          color: var(--cor-perigo);
        }

        .btn-remover:hover {
          background-color: var(--cor-perigo);
          color: white;
        }

        .empty-message {
          text-align: center;
          color: var(--cor-texto-secundario);
          padding: 2rem;
          font-style: italic;
        }

        .empty-message.hidden {
          display: none;
        }

        #explore-container,
        #biblioteca-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .btn-adicionar:not(:disabled):active {
          animation: pulse 0.2s ease;
        }

        @media (max-width: 768px) {
          #explore-container,
          #biblioteca-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Seção de obras disponíveis */}
      <section className="section mb-8">
        <h2 className="text-xl font-semibold mb-4">🔥 Obras Disponíveis</h2>
        <div id="explore-container" ref={containerRef}></div>
      </section>

      {/* Seção da biblioteca do usuário */}
      <section className="section">
        <h2 className="text-xl font-semibold mb-4">
          📖 Minha Biblioteca <span id="biblioteca-count" ref={bibliotecaCountRef}>(0)</span>
        </h2>
        <div id="biblioteca-container" ref={bibliotecaContainerRef}></div>
        <p id="biblioteca-empty" ref={bibliotecaEmptyRef} className="empty-message">
          Sua biblioteca está vazia. Adicione obras acima!
        </p>
      </section>
    </div>
  );
};
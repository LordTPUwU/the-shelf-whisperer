/**
 * ============================================
 * EXPLORAR OBRAS - JavaScript Puro
 * Projeto Acadêmico - Manipulação do DOM
 * ============================================
 * 
 * Este arquivo demonstra manipulação direta do DOM
 * usando apenas JavaScript puro (Vanilla JS).
 * 
 * Conceitos demonstrados:
 * - document.createElement
 * - appendChild / append
 * - innerHTML e textContent
 * - addEventListener com arrow functions
 * - Renderização dinâmica a partir de arrays
 * - Atualização do DOM sem recarregar a página
 */

// ============================================
// DADOS - Array de objetos com obras disponíveis
// ============================================

const obrasDisponiveis = [
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
    id: 3,
    titulo: "1984",
    tipo: "livro",
    descricao: "Um clássico distópico de George Orwell sobre um regime totalitário que controla todos os aspectos da vida humana.",
    imagem: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
    ano: 1949,
    avaliacao: 9.2
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
    id: 6,
    titulo: "O Senhor dos Anéis",
    tipo: "livro",
    descricao: "A épica jornada de Frodo Baggins para destruir o Um Anel e salvar a Terra Média do Senhor do Escuro Sauron.",
    imagem: "https://covers.openlibrary.org/b/id/8743775-L.jpg",
    ano: 1954,
    avaliacao: 9.4
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
  },
  {
    id: 9,
    titulo: "Dom Quixote",
    tipo: "livro",
    descricao: "As aventuras de um fidalgo espanhol que, enlouquecido pela leitura de romances de cavalaria, decide tornar-se cavaleiro andante.",
    imagem: "https://covers.openlibrary.org/b/id/8091016-L.jpg",
    ano: 1605,
    avaliacao: 8.9
  }
];

// ============================================
// ESTADO DA APLICAÇÃO
// ============================================

// Array que armazena as obras na biblioteca do usuário
let bibliotecaUsuario = [];

// Filtro atual selecionado
let filtroAtual = "todos";

// Termo de busca atual
let termoBuscaAtual = "";

// ============================================
// SELETORES DO DOM
// ============================================

/**
 * Função para obter referências aos elementos do DOM
 * Executada após o carregamento da página
 */
const obterElementos = () => ({
  exploreContainer: document.getElementById("explore-container"),
  bibliotecaContainer: document.getElementById("biblioteca-container"),
  bibliotecaCount: document.getElementById("biblioteca-count"),
  bibliotecaEmpty: document.getElementById("biblioteca-empty"),
  searchInput: document.getElementById("search-input"),
  filterButtons: document.querySelectorAll(".filter-btn")
});

// ============================================
// FUNÇÕES DE CRIAÇÃO DE ELEMENTOS
// ============================================

/**
 * Cria o elemento de imagem do card
 * @param {string} src - URL da imagem
 * @param {string} alt - Texto alternativo
 * @returns {HTMLImageElement} Elemento img criado
 */
const criarImagemCard = (src, alt) => {
  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  img.className = "obra-card__imagem";
  
  // Fallback para imagem não encontrada
  img.onerror = () => {
    img.src = "https://via.placeholder.com/280x180?text=Sem+Imagem";
  };
  
  return img;
};

/**
 * Cria o badge de tipo (filme, série, livro)
 * @param {string} tipo - Tipo da obra
 * @returns {HTMLSpanElement} Elemento span com o badge
 */
const criarBadgeTipo = (tipo) => {
  const badge = document.createElement("span");
  badge.className = `obra-card__tipo obra-card__tipo--${tipo}`;
  
  // Define o texto e emoji baseado no tipo
  const tiposTexto = {
    filme: "🎬 Filme",
    serie: "📺 Série",
    livro: "📖 Livro"
  };
  
  badge.textContent = tiposTexto[tipo] || tipo;
  return badge;
};

/**
 * Cria o título do card
 * @param {string} titulo - Título da obra
 * @returns {HTMLHeadingElement} Elemento h3 com o título
 */
const criarTituloCard = (titulo) => {
  const h3 = document.createElement("h3");
  h3.className = "obra-card__titulo";
  h3.textContent = titulo;
  return h3;
};

/**
 * Cria a descrição do card
 * @param {string} descricao - Descrição da obra
 * @returns {HTMLParagraphElement} Elemento p com a descrição
 */
const criarDescricaoCard = (descricao) => {
  const p = document.createElement("p");
  p.className = "obra-card__descricao";
  p.textContent = descricao;
  return p;
};

/**
 * Cria a seção de informações (ano e avaliação)
 * @param {number} ano - Ano de lançamento
 * @param {number} avaliacao - Nota de avaliação
 * @returns {HTMLDivElement} Elemento div com as informações
 */
const criarInfoCard = (ano, avaliacao) => {
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

/**
 * Cria o botão de adicionar à biblioteca
 * @param {Object} obra - Objeto da obra
 * @param {boolean} jaAdicionada - Se a obra já está na biblioteca
 * @returns {HTMLButtonElement} Elemento button
 */
const criarBotaoAdicionar = (obra, jaAdicionada) => {
  const button = document.createElement("button");
  button.className = "btn btn-adicionar";
  button.disabled = jaAdicionada;
  
  if (jaAdicionada) {
    button.textContent = "✓ Na Biblioteca";
  } else {
    button.textContent = "+ Adicionar";
    
    // Adiciona evento de clique usando arrow function
    button.addEventListener("click", () => {
      adicionarNaBiblioteca(obra);
    });
  }
  
  return button;
};

/**
 * Cria o botão de remover da biblioteca
 * @param {Object} obra - Objeto da obra
 * @returns {HTMLButtonElement} Elemento button
 */
const criarBotaoRemover = (obra) => {
  const button = document.createElement("button");
  button.className = "btn btn-remover";
  button.textContent = "🗑 Remover";
  
  // Adiciona evento de clique usando arrow function
  button.addEventListener("click", () => {
    removerDaBiblioteca(obra.id);
  });
  
  return button;
};

/**
 * Cria a seção de botões do card
 * @param {Object} obra - Objeto da obra
 * @param {boolean} modoBiblioteca - Se está renderizando na biblioteca
 * @returns {HTMLDivElement} Elemento div com os botões
 */
const criarBotoesCard = (obra, modoBiblioteca = false) => {
  const div = document.createElement("div");
  div.className = "obra-card__botoes";
  
  if (modoBiblioteca) {
    div.appendChild(criarBotaoRemover(obra));
  } else {
    const jaAdicionada = verificarSeAdicionada(obra.id);
    div.appendChild(criarBotaoAdicionar(obra, jaAdicionada));
  }
  
  return div;
};

/**
 * Cria um card completo de obra
 * @param {Object} obra - Objeto com dados da obra
 * @param {boolean} modoBiblioteca - Se está renderizando na biblioteca
 * @returns {HTMLDivElement} Card completo da obra
 */
const criarCardObra = (obra, modoBiblioteca = false) => {
  // Cria o container do card
  const card = document.createElement("div");
  card.className = "obra-card";
  card.dataset.id = obra.id; // Armazena o ID no atributo data-id
  
  // Adiciona os elementos filhos usando appendChild
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

/**
 * Renderiza a lista de obras disponíveis para explorar
 * Aplica filtros de tipo e busca
 */
const renderizarListaExplorar = () => {
  const { exploreContainer } = obterElementos();
  
  // Limpa o container antes de renderizar
  exploreContainer.innerHTML = "";
  
  // Filtra as obras baseado no filtro atual e termo de busca
  const obrasFiltradas = obrasDisponiveis.filter((obra) => {
    const matchTipo = filtroAtual === "todos" || obra.tipo === filtroAtual;
    const matchBusca = obra.titulo.toLowerCase().includes(termoBuscaAtual.toLowerCase());
    return matchTipo && matchBusca;
  });
  
  // Cria e adiciona cada card ao container
  obrasFiltradas.forEach((obra) => {
    const card = criarCardObra(obra, false);
    exploreContainer.appendChild(card);
  });
  
  // Mostra mensagem se não houver resultados
  if (obrasFiltradas.length === 0) {
    const mensagem = document.createElement("p");
    mensagem.className = "empty-message";
    mensagem.textContent = "Nenhuma obra encontrada com os filtros atuais.";
    exploreContainer.appendChild(mensagem);
  }
};

/**
 * Renderiza a biblioteca do usuário
 */
const renderizarBiblioteca = () => {
  const { bibliotecaContainer, bibliotecaCount, bibliotecaEmpty } = obterElementos();
  
  // Limpa o container
  bibliotecaContainer.innerHTML = "";
  
  // Atualiza o contador
  bibliotecaCount.textContent = `(${bibliotecaUsuario.length})`;
  
  // Mostra/esconde mensagem de vazio
  if (bibliotecaUsuario.length === 0) {
    bibliotecaEmpty.classList.remove("hidden");
  } else {
    bibliotecaEmpty.classList.add("hidden");
    
    // Renderiza cada obra da biblioteca
    bibliotecaUsuario.forEach((obra) => {
      const card = criarCardObra(obra, true);
      bibliotecaContainer.appendChild(card);
    });
  }
};

/**
 * Atualiza toda a interface (re-render completo)
 */
const atualizarInterface = () => {
  renderizarListaExplorar();
  renderizarBiblioteca();
};

// ============================================
// FUNÇÕES DE MANIPULAÇÃO DE DADOS
// ============================================

/**
 * Verifica se uma obra já está na biblioteca
 * @param {number} id - ID da obra
 * @returns {boolean} True se já está na biblioteca
 */
const verificarSeAdicionada = (id) => {
  return bibliotecaUsuario.some((obra) => obra.id === id);
};

/**
 * Adiciona uma obra à biblioteca do usuário
 * @param {Object} obra - Obra a ser adicionada
 */
const adicionarNaBiblioteca = (obra) => {
  // Verifica se já não está na biblioteca
  if (!verificarSeAdicionada(obra.id)) {
    // Adiciona ao array com dados relevantes
    bibliotecaUsuario.push({
      id: obra.id,
      titulo: obra.titulo,
      tipo: obra.tipo,
      descricao: obra.descricao,
      imagem: obra.imagem,
      ano: obra.ano,
      avaliacao: obra.avaliacao,
      dataAdicao: new Date().toISOString()
    });
    
    // Salva no localStorage para persistência
    salvarNoLocalStorage();
    
    // Atualiza a interface
    atualizarInterface();
    
    console.log(`✅ "${obra.titulo}" adicionado à biblioteca!`);
  }
};

/**
 * Remove uma obra da biblioteca pelo ID
 * @param {number} id - ID da obra a ser removida
 */
const removerDaBiblioteca = (id) => {
  // Encontra a obra para log
  const obra = bibliotecaUsuario.find((o) => o.id === id);
  
  // Remove do array
  bibliotecaUsuario = bibliotecaUsuario.filter((obra) => obra.id !== id);
  
  // Remove o card do DOM com animação
  const card = document.querySelector(`.obra-card[data-id="${id}"]`);
  if (card && card.closest("#biblioteca-container")) {
    card.style.opacity = "0";
    card.style.transform = "scale(0.8)";
    
    setTimeout(() => {
      // Salva e atualiza após animação
      salvarNoLocalStorage();
      atualizarInterface();
    }, 300);
  } else {
    salvarNoLocalStorage();
    atualizarInterface();
  }
  
  if (obra) {
    console.log(`🗑 "${obra.titulo}" removido da biblioteca!`);
  }
};

// ============================================
// PERSISTÊNCIA (localStorage)
// ============================================

/**
 * Salva a biblioteca no localStorage
 */
const salvarNoLocalStorage = () => {
  localStorage.setItem("biblioteca_usuario", JSON.stringify(bibliotecaUsuario));
};

/**
 * Carrega a biblioteca do localStorage
 */
const carregarDoLocalStorage = () => {
  const dados = localStorage.getItem("biblioteca_usuario");
  if (dados) {
    bibliotecaUsuario = JSON.parse(dados);
  }
};

// ============================================
// EVENT LISTENERS
// ============================================

/**
 * Configura os event listeners da aplicação
 */
const configurarEventListeners = () => {
  const { searchInput, filterButtons } = obterElementos();
  
  // Evento de busca (input)
  searchInput.addEventListener("input", (evento) => {
    termoBuscaAtual = evento.target.value;
    renderizarListaExplorar();
  });
  
  // Eventos dos botões de filtro
  filterButtons.forEach((botao) => {
    botao.addEventListener("click", (evento) => {
      // Remove classe active de todos
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      
      // Adiciona classe active ao clicado
      evento.target.classList.add("active");
      
      // Atualiza o filtro atual
      filtroAtual = evento.target.dataset.tipo;
      
      // Re-renderiza a lista
      renderizarListaExplorar();
    });
  });
};

// ============================================
// INICIALIZAÇÃO
// ============================================

/**
 * Função de inicialização da aplicação
 * Executada quando o DOM está pronto
 */
const inicializarApp = () => {
  console.log("🚀 Aplicação inicializada!");
  console.log("📚 Demonstração de manipulação do DOM com JavaScript puro");
  
  // Carrega dados salvos
  carregarDoLocalStorage();
  
  // Configura event listeners
  configurarEventListeners();
  
  // Renderiza a interface inicial
  atualizarInterface();
};

// Executa quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", inicializarApp);

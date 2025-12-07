export type TipoObra = "livro" | "filme" | "serie";

export type Genero =
  | "Ficção"
  | "Romance"
  | "Fantasia"
  | "Mistério"
  | "Terror"
  | "Aventura"
  | "Biografia"
  | "História"
  | "Ciência"
  | "Comédia"
  | "Drama"
  | "Ação"
  | "Documentário"
  | "Outros";

export interface Obra {
  id: string;
  apiId?: string; // ID da obra na API externa
  nome: string;
  tipo: TipoObra;
  genero: Genero;
  descricao: string;
  imagem?: string;
  curtida: boolean;
  desejos: boolean;
  dataCriacao: string;
  dataLancamento?: string;
  avaliacao?: number;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  bio?: string;
  imagem?: string;
  obras: Obra[];
}

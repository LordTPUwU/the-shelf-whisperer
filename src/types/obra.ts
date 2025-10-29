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
  nome: string;
  tipo: TipoObra;
  genero: Genero;
  descricao: string;
  imagem?: string;
  curtida: boolean;
  desejos: boolean;
  dataCriacao: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  bio?: string;
  imagem?: string;
  obras: Obra[];
}

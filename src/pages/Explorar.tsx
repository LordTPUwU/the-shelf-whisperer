import { useState } from "react";
import { Search, Plus, Loader2, BookOpen } from "lucide-react";
import { useObras } from "@/contexts/ObrasContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface BookResult {
  id: string;
  title: string;
  authors?: string[];
  description?: string;
  imageLinks?: { thumbnail?: string };
  categories?: string[];
}

const Explorar = () => {
  const { adicionarObra } = useObras();
  const [busca, setBusca] = useState("");
  const [resultados, setResultados] = useState<BookResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const buscarLivros = async () => {
    if (!busca.trim()) {
      toast.error("Digite algo para buscar");
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(busca)}&maxResults=20&langRestrict=pt`
      );
      const data = await response.json();

      if (data.items) {
        setResultados(data.items.map((item: any) => ({
          id: item.id,
          title: item.volumeInfo.title,
          authors: item.volumeInfo.authors,
          description: item.volumeInfo.description,
          imageLinks: item.volumeInfo.imageLinks,
          categories: item.volumeInfo.categories,
        })));
      } else {
        setResultados([]);
        toast.info("Nenhum resultado encontrado");
      }
    } catch (error) {
      toast.error("Erro ao buscar livros. Tente novamente.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const adicionarNaBiblioteca = (book: BookResult) => {
    adicionarObra({
      nome: book.title,
      tipo: "livro",
      genero: book.categories?.[0] as any || "Ficção",
      descricao: book.description?.substring(0, 200) || "Sem descrição disponível",
      imagem: book.imageLinks?.thumbnail?.replace("http:", "https:"),
      curtida: false,
      desejos: true,
    });
    toast.success(`"${book.title}" adicionado à sua biblioteca! 📚`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Explorar Livros 🌍</h1>
          <p className="text-muted-foreground">
            Busque livros na base do Google Books e adicione à sua biblioteca
          </p>
        </div>

        {/* Busca */}
        <div className="card-gradient p-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Buscar livros... (ex: O Hobbit, Machado de Assis, Ficção Científica)"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && buscarLivros()}
                className="pl-10"
                disabled={loading}
              />
            </div>
            <Button onClick={buscarLivros} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Resultados */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">Buscando livros incríveis...</p>
            </div>
          </div>
        ) : searched && resultados.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              Nenhum livro encontrado. Tente outra busca!
            </p>
          </div>
        ) : resultados.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {resultados.map((book) => (
              <Card key={book.id} className="card-gradient overflow-hidden flex flex-col">
                <CardHeader className="p-0">
                  {book.imageLinks?.thumbnail ? (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={book.imageLinks.thumbnail.replace("http:", "https:")}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </CardHeader>

                <CardContent className="flex-1 pt-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{book.title}</h3>
                  {book.authors && (
                    <p className="text-sm text-muted-foreground mb-2">
                      Por: {book.authors.join(", ")}
                    </p>
                  )}
                  {book.categories && (
                    <Badge variant="outline" className="mb-3">
                      {book.categories[0]}
                    </Badge>
                  )}
                  {book.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {book.description}
                    </p>
                  )}
                </CardContent>

                <CardFooter className="pt-4 border-t">
                  <Button
                    onClick={() => adicionarNaBiblioteca(book)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar à Biblioteca
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Descubra novos livros</h2>
            <p className="text-muted-foreground">
              Use a busca acima para encontrar livros e adicioná-los à sua biblioteca
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Explorar;

import { useState, useEffect } from "react";
import { Search, Plus, Loader2, BookOpen, Film, Tv, TrendingUp, Star, Calendar, Check } from "lucide-react";
import { useObras } from "@/contexts/ObrasContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { TipoObra } from "@/types/obra";

const TMDB_API_KEY = "2f7d7d8f5c5d1c8e9b0a3f4e6d7c8b9a"; // Demo key - users should replace with their own
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

interface MediaResult {
  id: string;
  apiId: string;
  title: string;
  type: TipoObra;
  description?: string;
  image?: string;
  releaseDate?: string;
  rating?: number;
  genres?: string[];
}

const Explorar = () => {
  const { adicionarObra, obras } = useObras();
  const [busca, setBusca] = useState("");
  const [resultados, setResultados] = useState<MediaResult[]>([]);
  const [tendencias, setTendencias] = useState<MediaResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [searched, setSearched] = useState(false);
  const [activeTab, setActiveTab] = useState<"filme" | "serie" | "livro">("filme");

  // Verificar se obra já está na biblioteca
  const obraJaAdicionada = (apiId: string, tipo: TipoObra) => {
    return obras.some(obra => obra.apiId === apiId && obra.tipo === tipo);
  };

  // Buscar tendências ao carregar
  useEffect(() => {
    carregarTendencias();
  }, [activeTab]);

  const carregarTendencias = async () => {
    setLoadingTrending(true);
    try {
      if (activeTab === "livro") {
        // Google Books - buscar livros populares
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=relevance&maxResults=12&langRestrict=pt`
        );
        const data = await response.json();
        
        if (data.items) {
          setTendencias(data.items.map((item: any) => ({
            id: item.id,
            apiId: item.id,
            title: item.volumeInfo.title,
            type: "livro" as TipoObra,
            description: item.volumeInfo.description,
            image: item.volumeInfo.imageLinks?.thumbnail?.replace("http:", "https:"),
            releaseDate: item.volumeInfo.publishedDate,
            rating: item.volumeInfo.averageRating,
            genres: item.volumeInfo.categories,
          })));
        }
      } else {
        // TMDB - filmes ou séries
        const endpoint = activeTab === "filme" ? "movie" : "tv";
        const response = await fetch(
          `${TMDB_BASE_URL}/trending/${endpoint}/week?api_key=${TMDB_API_KEY}&language=pt-BR`
        );
        const data = await response.json();
        
        if (data.results) {
          setTendencias(data.results.slice(0, 12).map((item: any) => ({
            id: item.id.toString(),
            apiId: item.id.toString(),
            title: item.title || item.name,
            type: activeTab,
            description: item.overview,
            image: item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : undefined,
            releaseDate: item.release_date || item.first_air_date,
            rating: item.vote_average,
            genres: item.genre_ids,
          })));
        }
      }
    } catch (error) {
      console.error("Erro ao carregar tendências:", error);
      toast.error("Erro ao carregar tendências");
    } finally {
      setLoadingTrending(false);
    }
  };

  const buscarObras = async () => {
    if (!busca.trim()) {
      toast.error("Digite algo para buscar");
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      if (activeTab === "livro") {
        // Google Books API
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(busca)}&maxResults=20&langRestrict=pt`
        );
        const data = await response.json();

        if (data.items) {
          setResultados(data.items.map((item: any) => ({
            id: item.id,
            apiId: item.id,
            title: item.volumeInfo.title,
            type: "livro" as TipoObra,
            description: item.volumeInfo.description,
            image: item.volumeInfo.imageLinks?.thumbnail?.replace("http:", "https:"),
            releaseDate: item.volumeInfo.publishedDate,
            rating: item.volumeInfo.averageRating,
            genres: item.volumeInfo.categories,
          })));
        } else {
          setResultados([]);
          toast.info("Nenhum resultado encontrado");
        }
      } else {
        // TMDB API - filmes ou séries
        const endpoint = activeTab === "filme" ? "movie" : "tv";
        const response = await fetch(
          `${TMDB_BASE_URL}/search/${endpoint}?api_key=${TMDB_API_KEY}&language=pt-BR&query=${encodeURIComponent(busca)}`
        );
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          setResultados(data.results.map((item: any) => ({
            id: item.id.toString(),
            apiId: item.id.toString(),
            title: item.title || item.name,
            type: activeTab,
            description: item.overview,
            image: item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : undefined,
            releaseDate: item.release_date || item.first_air_date,
            rating: item.vote_average,
            genres: item.genre_ids,
          })));
        } else {
          setResultados([]);
          toast.info("Nenhum resultado encontrado");
        }
      }
    } catch (error) {
      toast.error("Erro ao buscar. Tente novamente.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const adicionarNaBiblioteca = (media: MediaResult, comCurtida: boolean = false) => {
    const generoMap: Record<number, string> = {
      28: "Ação", 12: "Aventura", 16: "Fantasia", 35: "Comédia",
      80: "Mistério", 99: "Documentário", 18: "Drama", 10751: "Romance",
      14: "Fantasia", 36: "História", 27: "Terror", 10402: "Outros",
      9648: "Mistério", 10749: "Romance", 878: "Ficção", 10770: "Drama",
      53: "Mistério", 10752: "Ação", 37: "Aventura"
    };

    let genero = "Outros";
    if (media.genres && media.genres.length > 0) {
      if (typeof media.genres[0] === "number") {
        genero = generoMap[media.genres[0]] || "Outros";
      } else {
        genero = media.genres[0] as string;
      }
    }

    adicionarObra({
      apiId: media.apiId,
      nome: media.title,
      tipo: media.type,
      genero: genero as any,
      descricao: media.description?.substring(0, 300) || "Sem descrição disponível",
      imagem: media.image,
      curtida: comCurtida,
      desejos: !comCurtida,
      dataLancamento: media.releaseDate,
      avaliacao: media.rating,
    });
    
    const tipoNome = media.type === "filme" ? "Filme" : media.type === "serie" ? "Série" : "Livro";
    toast.success(`${tipoNome} "${media.title}" adicionado à sua biblioteca!`);
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "filme": return <Film className="h-4 w-4" />;
      case "serie": return <Tv className="h-4 w-4" />;
      case "livro": return <BookOpen className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR", { year: "numeric" });
    } catch {
      return dateString.substring(0, 4);
    }
  };

  const renderMediaCard = (media: MediaResult) => {
    const jaAdicionada = obraJaAdicionada(media.apiId, media.type);
    
    return (
      <Card key={`${media.type}-${media.id}`} className="card-gradient overflow-hidden flex flex-col">
        <CardHeader className="p-0">
          {media.image ? (
            <div className="h-56 overflow-hidden">
              <img
                src={media.image}
                alt={media.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-56 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              {getTabIcon(media.type)}
            </div>
          )}
        </CardHeader>

        <CardContent className="flex-1 pt-4 space-y-2">
          <h3 className="font-semibold text-lg line-clamp-2">{media.title}</h3>
          
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {media.releaseDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(media.releaseDate)}
              </span>
            )}
            {media.rating !== undefined && media.rating > 0 && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                {media.rating.toFixed(1)}
              </span>
            )}
          </div>

          {media.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {media.description}
            </p>
          )}
        </CardContent>

        <CardFooter className="pt-4 border-t gap-2">
          {jaAdicionada ? (
            <Button variant="secondary" className="w-full" disabled>
              <Check className="h-4 w-4 mr-2" />
              Já na biblioteca
            </Button>
          ) : (
            <>
              <Button
                onClick={() => adicionarNaBiblioteca(media, false)}
                variant="outline"
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-1" />
                Lista
              </Button>
              <Button
                onClick={() => adicionarNaBiblioteca(media, true)}
                className="flex-1"
              >
                <Star className="h-4 w-4 mr-1" />
                Curtir
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Explorar</h1>
          <p className="text-muted-foreground">
            Descubra filmes, séries e livros para adicionar à sua biblioteca
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => { 
          setActiveTab(v as any); 
          setResultados([]); 
          setSearched(false); 
        }}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="filme" className="flex items-center gap-2">
              <Film className="h-4 w-4" />
              Filmes
            </TabsTrigger>
            <TabsTrigger value="serie" className="flex items-center gap-2">
              <Tv className="h-4 w-4" />
              Séries
            </TabsTrigger>
            <TabsTrigger value="livro" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Livros
            </TabsTrigger>
          </TabsList>

          {/* Busca */}
          <div className="card-gradient p-6 mb-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder={`Buscar ${activeTab === "filme" ? "filmes" : activeTab === "serie" ? "séries" : "livros"}...`}
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && buscarObras()}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
              <Button onClick={buscarObras} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Resultados da busca */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                <p className="text-muted-foreground">Buscando...</p>
              </div>
            </div>
          ) : searched && resultados.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum resultado encontrado</p>
            </div>
          ) : resultados.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Resultados da busca</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {resultados.map(renderMediaCard)}
              </div>
            </div>
          ) : null}

          {/* Tendências */}
          {!searched && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">
                  Em alta esta semana
                </h2>
              </div>
              
              {loadingTrending ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : tendencias.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {tendencias.map(renderMediaCard)}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Não foi possível carregar as tendências
                  </p>
                </div>
              )}
            </div>
          )}
        </Tabs>
      </div>
    </Layout>
  );
};

export default Explorar;

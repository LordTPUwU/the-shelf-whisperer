import { useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { useObras } from "@/contexts/ObrasContext";
import Layout from "@/components/Layout";
import ObraCard from "@/components/ObraCard";
import ObraModal from "@/components/ObraModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Obra, TipoObra, Genero } from "@/types/obra";
import { toast } from "sonner";

const Biblioteca = () => {
  const { obras, adicionarObra, editarObra, removerObra, toggleCurtida, toggleDesejos } = useObras();
  const [modalOpen, setModalOpen] = useState(false);
  const [obraEditando, setObraEditando] = useState<Obra | null>(null);
  const [busca, setBusca] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState<TipoObra | "todas">("todas");
  const [generoFiltro, setGeneroFiltro] = useState<Genero | "todos">("todos");

  const handleSave = (obraData: Omit<Obra, "id" | "dataCriacao">) => {
    if (obraEditando) {
      editarObra(obraEditando.id, obraData);
      toast.success("Obra atualizada com sucesso! ✨");
    } else {
      adicionarObra(obraData);
      toast.success("Obra adicionada à sua biblioteca! 🎉");
    }
    setObraEditando(null);
  };

  const handleEditar = (obra: Obra) => {
    setObraEditando(obra);
    setModalOpen(true);
  };

  const handleRemover = (id: string) => {
    removerObra(id);
    toast.success("Obra removida da biblioteca");
  };

  const handleCurtir = (id: string) => {
    toggleCurtida(id);
    const obra = obras.find((o) => o.id === id);
    if (obra && !obra.curtida) {
      toast.success("❤️ Adicionado às curtidas!");
    }
  };

  const filtrarObras = (lista: Obra[]) => {
    return lista.filter((obra) => {
      const matchBusca = obra.nome.toLowerCase().includes(busca.toLowerCase()) ||
        obra.descricao.toLowerCase().includes(busca.toLowerCase());
      const matchTipo = tipoFiltro === "todas" || obra.tipo === tipoFiltro;
      const matchGenero = generoFiltro === "todos" || obra.genero === generoFiltro;
      return matchBusca && matchTipo && matchGenero;
    });
  };

  const obrasCurtidas = filtrarObras(obras.filter((o) => o.curtida));
  const obrasDesejos = filtrarObras(obras.filter((o) => o.desejos));
  const todasObras = filtrarObras(obras);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Minha Biblioteca</h1>
            <p className="text-muted-foreground">
              {obras.length} {obras.length === 1 ? "obra" : "obras"} na sua coleção
            </p>
          </div>
          <Button
            onClick={() => {
              setObraEditando(null);
              setModalOpen(true);
            }}
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Adicionar Obra
          </Button>
        </div>

        {/* Filtros */}
        <div className="card-gradient p-4 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Filter className="h-4 w-4" />
            Filtros
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={tipoFiltro} onValueChange={(value: any) => setTipoFiltro(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todos os tipos</SelectItem>
                <SelectItem value="livro">📚 Livros</SelectItem>
                <SelectItem value="filme">🎬 Filmes</SelectItem>
                <SelectItem value="serie">📺 Séries</SelectItem>
              </SelectContent>
            </Select>
            <Select value={generoFiltro} onValueChange={(value: any) => setGeneroFiltro(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Gênero" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os gêneros</SelectItem>
                <SelectItem value="Ficção">Ficção</SelectItem>
                <SelectItem value="Romance">Romance</SelectItem>
                <SelectItem value="Fantasia">Fantasia</SelectItem>
                <SelectItem value="Mistério">Mistério</SelectItem>
                <SelectItem value="Terror">Terror</SelectItem>
                <SelectItem value="Aventura">Aventura</SelectItem>
                <SelectItem value="Comédia">Comédia</SelectItem>
                <SelectItem value="Drama">Drama</SelectItem>
                <SelectItem value="Ação">Ação</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="todas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="todas">
              Todas ({todasObras.length})
            </TabsTrigger>
            <TabsTrigger value="curtidas">
              ❤️ Curtidas ({obrasCurtidas.length})
            </TabsTrigger>
            <TabsTrigger value="desejos">
              💭 Desejos ({obrasDesejos.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="todas">
            {todasObras.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  Sua biblioteca está vazia. Adicione sua primeira obra!
                </p>
                <Button onClick={() => setModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Obra
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {todasObras.map((obra) => (
                  <ObraCard
                    key={obra.id}
                    obra={obra}
                    onCurtir={handleCurtir}
                    onRemover={handleRemover}
                    onEditar={handleEditar}
                    onToggleDesejos={toggleDesejos}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="curtidas">
            {obrasCurtidas.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Você ainda não curtiu nenhuma obra
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {obrasCurtidas.map((obra) => (
                  <ObraCard
                    key={obra.id}
                    obra={obra}
                    onCurtir={handleCurtir}
                    onRemover={handleRemover}
                    onEditar={handleEditar}
                    onToggleDesejos={toggleDesejos}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="desejos">
            {obrasDesejos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Você ainda não tem obras na lista de desejos
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {obrasDesejos.map((obra) => (
                  <ObraCard
                    key={obra.id}
                    obra={obra}
                    onCurtir={handleCurtir}
                    onRemover={handleRemover}
                    onEditar={handleEditar}
                    onToggleDesejos={toggleDesejos}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <ObraModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setObraEditando(null);
        }}
        onSave={handleSave}
        obraEditando={obraEditando}
      />
    </Layout>
  );
};

export default Biblioteca;

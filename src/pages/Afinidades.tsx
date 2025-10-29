import Layout from "@/components/Layout";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, Users } from "lucide-react";
import { useObras } from "@/contexts/ObrasContext";

interface UsuarioSugerido {
  id: string;
  nome: string;
  avatar: string;
  bio: string;
  generosFavoritos: string[];
  afinidade: number;
}

const Afinidades = () => {
  const { obras } = useObras();

  // Simulação de usuários com afinidades
  const usuariosSugeridos: UsuarioSugerido[] = [
    {
      id: "1",
      nome: "Ana Silva",
      avatar: "AS",
      bio: "Apaixonada por fantasia e ficção científica 🚀",
      generosFavoritos: ["Fantasia", "Ficção", "Aventura"],
      afinidade: 85,
    },
    {
      id: "2",
      nome: "Carlos Mendes",
      avatar: "CM",
      bio: "Cinéfilo e leitor compulsivo de mistérios 🎬",
      generosFavoritos: ["Mistério", "Drama", "Terror"],
      afinidade: 72,
    },
    {
      id: "3",
      nome: "Beatriz Costa",
      avatar: "BC",
      bio: "Amo romances e histórias que emocionam 💕",
      generosFavoritos: ["Romance", "Drama", "Biografia"],
      afinidade: 68,
    },
    {
      id: "4",
      nome: "Diego Oliveira",
      avatar: "DO",
      bio: "Fã de ação e aventura em todas as formas! ⚔️",
      generosFavoritos: ["Ação", "Aventura", "Fantasia"],
      afinidade: 64,
    },
    {
      id: "5",
      nome: "Elena Santos",
      avatar: "ES",
      bio: "Documentários e não-ficção são meu forte 📚",
      generosFavoritos: ["Documentário", "História", "Ciência"],
      afinidade: 58,
    },
    {
      id: "6",
      nome: "Felipe Rocha",
      avatar: "FR",
      bio: "Comédia é essencial! Rir é viver 😄",
      generosFavoritos: ["Comédia", "Romance", "Ação"],
      afinidade: 55,
    },
  ];

  const getAfinidadeColor = (afinidade: number) => {
    if (afinidade >= 75) return "text-green-600 dark:text-green-400";
    if (afinidade >= 60) return "text-blue-600 dark:text-blue-400";
    return "text-purple-600 dark:text-purple-400";
  };

  const getAfinidadeLabel = (afinidade: number) => {
    if (afinidade >= 75) return "Alta afinidade";
    if (afinidade >= 60) return "Boa afinidade";
    return "Afinidade moderada";
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Afinidades 🤝</h1>
          <p className="text-muted-foreground">
            Encontre pessoas com gostos similares aos seus
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="card-gradient">
            <CardContent className="pt-6 text-center">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-3xl font-bold mb-1">{usuariosSugeridos.length}</p>
              <p className="text-sm text-muted-foreground">Usuários sugeridos</p>
            </CardContent>
          </Card>
          <Card className="card-gradient">
            <CardContent className="pt-6 text-center">
              <Heart className="h-8 w-8 text-pink mx-auto mb-2" />
              <p className="text-3xl font-bold mb-1">{obras.filter(o => o.curtida).length}</p>
              <p className="text-sm text-muted-foreground">Suas curtidas</p>
            </CardContent>
          </Card>
          <Card className="card-gradient">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl mb-2">📚</div>
              <p className="text-3xl font-bold mb-1">{obras.length}</p>
              <p className="text-sm text-muted-foreground">Total de obras</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de usuários */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {usuariosSugeridos.map((usuario) => (
            <Card key={usuario.id} className="card-gradient overflow-hidden">
              <CardHeader className="text-center pb-4">
                <Avatar className="h-20 w-20 mx-auto mb-3">
                  <AvatarFallback className="text-2xl bg-primary/20 text-primary">
                    {usuario.avatar}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{usuario.nome}</h3>
                <p className="text-sm text-muted-foreground">{usuario.bio}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className={`text-4xl font-bold ${getAfinidadeColor(usuario.afinidade)}`}>
                    {usuario.afinidade}%
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getAfinidadeLabel(usuario.afinidade)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Gêneros favoritos:</p>
                  <div className="flex flex-wrap gap-2">
                    {usuario.generosFavoritos.map((genero) => (
                      <Badge key={genero} variant="secondary">
                        {genero}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex gap-2 pt-4 border-t">
                <Button variant="outline" className="flex-1">
                  Ver Biblioteca
                </Button>
                <Button className="flex-1">
                  <Users className="h-4 w-4 mr-2" />
                  Seguir
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Dica */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <p className="text-sm text-center">
              💡 <strong>Dica:</strong> A afinidade é calculada com base nos gêneros e tipos
              de obras que você curte. Adicione mais obras para melhorar as sugestões!
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Afinidades;

import { Heart, Trash2, Edit, BookMarked } from "lucide-react";
import { Obra } from "@/types/obra";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useState } from "react";

interface ObraCardProps {
  obra: Obra;
  onCurtir: (id: string) => void;
  onRemover: (id: string) => void;
  onEditar: (obra: Obra) => void;
  onToggleDesejos?: (id: string) => void;
}

const ObraCard = ({ obra, onCurtir, onRemover, onEditar, onToggleDesejos }: ObraCardProps) => {
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);

  const handleCurtir = () => {
    setIsHeartAnimating(true);
    setTimeout(() => setIsHeartAnimating(false), 600);
    onCurtir(obra.id);
  };

  const tipoEmoji: Record<typeof obra.tipo, string> = {
    livro: "📚",
    filme: "🎬",
    serie: "📺",
  };

  const tipoLabel: Record<typeof obra.tipo, string> = {
    livro: "Livro",
    filme: "Filme",
    serie: "Série",
  };

  return (
    <Card className="card-gradient overflow-hidden h-full flex flex-col">
      <CardHeader className="p-0">
        {obra.imagem ? (
          <div className="relative h-48 overflow-hidden">
            <img
              src={obra.imagem}
              alt={obra.nome}
              className="w-full h-full object-cover transition-smooth hover:scale-105"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <Badge variant="secondary" className="backdrop-blur-sm bg-background/80">
                {tipoEmoji[obra.tipo]} {tipoLabel[obra.tipo]}
              </Badge>
            </div>
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <span className="text-6xl">{tipoEmoji[obra.tipo]}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 pt-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{obra.nome}</h3>
        <Badge variant="outline" className="mb-3">
          {obra.genero}
        </Badge>
        <p className="text-sm text-muted-foreground line-clamp-3">{obra.descricao}</p>
      </CardContent>

      <CardFooter className="flex gap-2 pt-4 border-t">
        <Button
          variant={obra.curtida ? "default" : "outline"}
          size="sm"
          onClick={handleCurtir}
          className={`flex-1 ${isHeartAnimating ? "heart-animate" : ""}`}
        >
          <Heart className={`h-4 w-4 mr-2 ${obra.curtida ? "fill-current" : ""}`} />
          {obra.curtida ? "Curtido" : "Curtir"}
        </Button>

        {onToggleDesejos && (
          <Button
            variant={obra.desejos ? "secondary" : "outline"}
            size="icon"
            onClick={() => onToggleDesejos(obra.id)}
            title={obra.desejos ? "Remover dos desejos" : "Adicionar aos desejos"}
          >
            <BookMarked className={`h-4 w-4 ${obra.desejos ? "fill-current" : ""}`} />
          </Button>
        )}

        <Button variant="outline" size="icon" onClick={() => onEditar(obra)}>
          <Edit className="h-4 w-4" />
        </Button>

        <Button variant="outline" size="icon" onClick={() => onRemover(obra.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ObraCard;

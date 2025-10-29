import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Obra, TipoObra, Genero } from "@/types/obra";
import { Upload } from "lucide-react";

interface ObraModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (obra: Omit<Obra, "id" | "dataCriacao">) => void;
  obraEditando?: Obra | null;
}

const generos: Genero[] = [
  "Ficção",
  "Romance",
  "Fantasia",
  "Mistério",
  "Terror",
  "Aventura",
  "Biografia",
  "História",
  "Ciência",
  "Comédia",
  "Drama",
  "Ação",
  "Documentário",
  "Outros",
];

const ObraModal = ({ open, onClose, onSave, obraEditando }: ObraModalProps) => {
  const [formData, setFormData] = useState({
    nome: "",
    tipo: "livro" as TipoObra,
    genero: "Ficção" as Genero,
    descricao: "",
    imagem: "",
    curtida: false,
    desejos: false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    if (obraEditando) {
      setFormData({
        nome: obraEditando.nome,
        tipo: obraEditando.tipo,
        genero: obraEditando.genero,
        descricao: obraEditando.descricao,
        imagem: obraEditando.imagem || "",
        curtida: obraEditando.curtida,
        desejos: obraEditando.desejos,
      });
      setImagePreview(obraEditando.imagem || "");
    } else {
      setFormData({
        nome: "",
        tipo: "livro",
        genero: "Ficção",
        descricao: "",
        imagem: "",
        curtida: false,
        desejos: false,
      });
      setImagePreview("");
    }
    setImageFile(null);
  }, [obraEditando, open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      imagem: imagePreview || formData.imagem,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {obraEditando ? "Editar Obra" : "Adicionar Nova Obra"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome da Obra *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Ex: O Hobbit, Interestelar, Breaking Bad..."
              required
            />
          </div>

          <div>
            <Label htmlFor="tipo">Tipo *</Label>
            <Select
              value={formData.tipo}
              onValueChange={(value: TipoObra) => setFormData({ ...formData, tipo: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="livro">📚 Livro</SelectItem>
                <SelectItem value="filme">🎬 Filme</SelectItem>
                <SelectItem value="serie">📺 Série</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="genero">Gênero *</Label>
            <Select
              value={formData.genero}
              onValueChange={(value: Genero) => setFormData({ ...formData, genero: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {generos.map((genero) => (
                  <SelectItem key={genero} value={genero}>
                    {genero}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Conte um pouco sobre esta obra..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="imagem">Imagem da Capa</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  id="imagem-file"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("imagem-file")?.click()}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Fazer Upload de Imagem
                </Button>
              </div>
              <div className="text-center text-sm text-muted-foreground">ou</div>
              <Input
                id="imagem-url"
                value={formData.imagem}
                onChange={(e) => setFormData({ ...formData, imagem: e.target.value })}
                placeholder="Cole a URL de uma imagem"
              />
              {imagePreview && (
                <div className="mt-2 rounded-lg overflow-hidden border">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-40 object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {obraEditando ? "Salvar Alterações" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ObraModal;

import { useState, useRef } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useObras } from "@/contexts/ObrasContext";
import { Edit2, Save, Trash2, Camera } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Perfil = () => {
  const { usuario, obras, atualizarPerfil, limparDados } = useObras();
  const [editando, setEditando] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    nome: usuario.nome,
    email: usuario.email,
    bio: usuario.bio || "",
    imagem: usuario.imagem || "",
  });

  const handleImageClick = () => {
    if (editando) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imagem: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    atualizarPerfil(formData);
    setEditando(false);
    toast.success("Perfil atualizado com sucesso! ✨");
  };

  const handleLimparDados = () => {
    limparDados();
    setShowDeleteDialog(false);
    toast.success("Todos os dados foram removidos");
  };

  const iniciais = usuario.nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Meu Perfil ⚙️</h1>
          <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
        </div>

        {/* Card do Perfil */}
        <Card className="card-gradient">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Informações Pessoais</CardTitle>
            {!editando ? (
              <Button onClick={() => setEditando(true)} variant="outline" size="sm">
                <Edit2 className="h-4 w-4 mr-2" />
                Editar
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
                <Button
                  onClick={() => {
                    setEditando(false);
                setFormData({
                  nome: usuario.nome,
                  email: usuario.email,
                  bio: usuario.bio || "",
                  imagem: usuario.imagem || "",
                });
                  }}
                  variant="outline"
                  size="sm"
                >
                  Cancelar
                </Button>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <Avatar 
                  className={`h-32 w-32 mb-4 ${editando ? 'cursor-pointer ring-2 ring-primary/50 hover:ring-primary transition-all' : ''}`}
                  onClick={handleImageClick}
                >
                  {formData.imagem && <AvatarImage src={formData.imagem} alt={usuario.nome} />}
                  <AvatarFallback className="text-4xl bg-primary/20 text-primary">
                    {iniciais}
                  </AvatarFallback>
                </Avatar>
                {editando && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer mb-4"
                    onClick={handleImageClick}
                  >
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              {!editando && (
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-1">{usuario.nome}</h2>
                  <p className="text-muted-foreground mb-2">{usuario.email}</p>
                  {usuario.bio && (
                    <p className="text-sm max-w-md mx-auto">{usuario.bio}</p>
                  )}
                </div>
              )}
            </div>

            {editando && (
              <div className="space-y-4 max-w-md mx-auto">
                <div>
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Conte um pouco sobre você e seus gostos..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="imagem">Foto de Perfil (URL) - Opcional</Label>
                  <Input
                    id="imagem"
                    type="url"
                    value={formData.imagem}
                    onChange={(e) => setFormData({ ...formData, imagem: e.target.value })}
                    placeholder="https://exemplo.com/sua-foto.jpg"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Ou clique na foto acima para fazer upload
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="card-gradient">
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold mb-1">{obras.length}</p>
              <p className="text-sm text-muted-foreground">Obras Totais</p>
            </CardContent>
          </Card>
          <Card className="card-gradient">
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold mb-1">
                {obras.filter((o) => o.curtida).length}
              </p>
              <p className="text-sm text-muted-foreground">Curtidas</p>
            </CardContent>
          </Card>
          <Card className="card-gradient">
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold mb-1">
                {obras.filter((o) => o.desejos).length}
              </p>
              <p className="text-sm text-muted-foreground">Desejos</p>
            </CardContent>
          </Card>
        </div>

        {/* Zona de Perigo */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Limpar todos os dados</p>
                <p className="text-sm text-muted-foreground">
                  Remove todas as obras e reseta o perfil. Esta ação não pode ser desfeita.
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                size="sm"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar Dados
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog de Confirmação */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação removerá permanentemente todas as suas obras e resetará seu perfil
              para os valores padrão. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleLimparDados} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Sim, limpar tudo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Perfil;

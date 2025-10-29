import { useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useObras } from "@/contexts/ObrasContext";
import { BookOpen, Film, Tv, Heart, BookMarked } from "lucide-react";

const Estatisticas = () => {
  const { obras } = useObras();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const estatisticas = {
    livros: obras.filter((o) => o.tipo === "livro").length,
    filmes: obras.filter((o) => o.tipo === "filme").length,
    series: obras.filter((o) => o.tipo === "serie").length,
    curtidas: obras.filter((o) => o.curtida).length,
    desejos: obras.filter((o) => o.desejos).length,
  };

  // Contagem por gênero
  const generosCont: Record<string, number> = {};
  obras.forEach((obra) => {
    generosCont[obra.genero] = (generosCont[obra.genero] || 0) + 1;
  });

  const generosOrdenados = Object.entries(generosCont)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  useEffect(() => {
    if (!canvasRef.current || generosOrdenados.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Configurar canvas
    canvas.width = 400;
    canvas.height = 400;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 150;

    // Cores pastéis
    const colors = [
      "hsl(270, 50%, 75%)", // lilac
      "hsl(215, 70%, 85%)", // blue
      "hsl(350, 100%, 90%)", // pink
      "hsl(35, 100%, 85%)", // cream
      "hsl(140, 50%, 80%)", // green
    ];

    const total = generosOrdenados.reduce((sum, [, count]) => sum + count, 0);
    let currentAngle = -Math.PI / 2;

    // Desenhar gráfico de pizza
    generosOrdenados.forEach(([genero, count], index) => {
      const sliceAngle = (count / total) * 2 * Math.PI;

      // Fatia
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Label
      const labelAngle = currentAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
      const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);

      ctx.fillStyle = "#000";
      ctx.font = "bold 14px Poppins, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${((count / total) * 100).toFixed(0)}%`, labelX, labelY);

      currentAngle += sliceAngle;
    });
  }, [generosOrdenados]);

  const stats = [
    { icon: BookOpen, label: "Livros", value: estatisticas.livros, color: "text-purple-500" },
    { icon: Film, label: "Filmes", value: estatisticas.filmes, color: "text-blue-500" },
    { icon: Tv, label: "Séries", value: estatisticas.series, color: "text-pink-500" },
    { icon: Heart, label: "Curtidas", value: estatisticas.curtidas, color: "text-red-500" },
    { icon: BookMarked, label: "Desejos", value: estatisticas.desejos, color: "text-yellow-500" },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Estatísticas 📊</h1>
          <p className="text-muted-foreground">
            Visualize seus hábitos e preferências culturais
          </p>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="card-gradient">
              <CardContent className="pt-6 text-center">
                <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-2`} />
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Gráfico de pizza */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle>Distribuição por Gêneros</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              {generosOrdenados.length > 0 ? (
                <canvas ref={canvasRef} className="max-w-full" />
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  Adicione obras para ver as estatísticas
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardHeader>
              <CardTitle>Top 5 Gêneros</CardTitle>
            </CardHeader>
            <CardContent>
              {generosOrdenados.length > 0 ? (
                <div className="space-y-4">
                  {generosOrdenados.map(([genero, count], index) => (
                    <div key={genero} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">
                          {index + 1}. {genero}
                        </span>
                        <span className="text-muted-foreground">{count} obras</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary rounded-full h-2 transition-smooth"
                          style={{
                            width: `${(count / obras.length) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  Nenhum dado disponível
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Resumo geral */}
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle>Resumo Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-lg">Suas Preferências</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Total de obras:</span>
                    <span className="font-medium">{obras.length}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Taxa de curtidas:</span>
                    <span className="font-medium">
                      {obras.length > 0
                        ? `${((estatisticas.curtidas / obras.length) * 100).toFixed(0)}%`
                        : "0%"}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Obras desejadas:</span>
                    <span className="font-medium">{estatisticas.desejos}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-lg">Distribuição por Tipo</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">📚 Livros:</span>
                    <span className="font-medium">
                      {obras.length > 0
                        ? `${((estatisticas.livros / obras.length) * 100).toFixed(0)}%`
                        : "0%"}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">🎬 Filmes:</span>
                    <span className="font-medium">
                      {obras.length > 0
                        ? `${((estatisticas.filmes / obras.length) * 100).toFixed(0)}%`
                        : "0%"}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">📺 Séries:</span>
                    <span className="font-medium">
                      {obras.length > 0
                        ? `${((estatisticas.series / obras.length) * 100).toFixed(0)}%`
                        : "0%"}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Estatisticas;

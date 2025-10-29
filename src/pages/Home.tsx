import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookHeart, Sparkles, Heart, Users, TrendingUp } from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: BookHeart,
      title: "Sua Estante Digital",
      description: "Organize livros, filmes e séries em um só lugar",
    },
    {
      icon: Heart,
      title: "Curtidas & Desejos",
      description: "Marque o que você ama e o que ainda quer consumir",
    },
    {
      icon: Users,
      title: "Descubra Afinidades",
      description: "Encontre pessoas com gostos similares aos seus",
    },
    {
      icon: TrendingUp,
      title: "Estatísticas",
      description: "Visualize seus hábitos e preferências culturais",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-background"></div>
        <div className="container relative py-20 md:py-32">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="flex items-center space-x-3">
              <BookHeart className="h-16 w-16 text-primary" />
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                MyShelf
              </h1>
            </div>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
              Sua biblioteca digital de desejos e curtidas 📚✨
            </p>

            <p className="text-lg text-foreground/80 max-w-xl">
              Organize suas obras culturais favoritas, descubra novas histórias e conecte-se
              com pessoas que compartilham seus gostos
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/biblioteca">
                <Button size="lg" className="text-lg px-8">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Começar Agora
                </Button>
              </Link>
              <Link to="/explorar">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Explorar Obras
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Tudo que você precisa para organizar sua cultura
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card-gradient p-6 text-center space-y-4"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20">
        <div className="card-gradient p-12 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Pronto para começar sua jornada cultural?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Crie sua biblioteca pessoal e nunca mais esqueça aquela obra incrível que
            alguém te recomendou
          </p>
          <Link to="/biblioteca">
            <Button size="lg" className="text-lg px-8 mt-4">
              Criar Minha Biblioteca
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <BookHeart className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">MyShelf</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Feito com 💜 para amantes de cultura
          </p>
          <p className="text-xs text-muted-foreground">
            © 2024 MyShelf. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

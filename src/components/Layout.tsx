import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookHeart, Heart, Compass, Users, User, BarChart3, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", String(newMode));
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/biblioteca", icon: BookHeart, label: "Biblioteca" },
    { path: "/explorar", icon: Compass, label: "Explorar" },
    { path: "/afinidades", icon: Users, label: "Afinidades" },
    { path: "/estatisticas", icon: BarChart3, label: "Estatísticas" },
    { path: "/perfil", icon: User, label: "Perfil" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 transition-smooth hover:opacity-80">
            <BookHeart className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              MyShelf
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  size="sm"
                  className="transition-smooth"
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="transition-smooth"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">{children}</main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className="flex-1">
              <Button
                variant={isActive(item.path) ? "default" : "ghost"}
                size="sm"
                className="w-full flex flex-col items-center gap-1 h-auto py-2"
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;

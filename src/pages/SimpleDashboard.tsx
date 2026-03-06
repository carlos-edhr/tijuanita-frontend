import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { User, LogOut, Settings, ArrowRight, Globe, FileText, Users, Lock } from "lucide-react";
import AppFooter from "../components/AppFooter";

const SimpleDashboard: React.FC = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-blancoHuesoFondo flex flex-col">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/images/landing/navbar2.png"
              alt="Tijuanita Mi Ciudad"
              className="h-10 w-auto"
            />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/profile"
              className="flex items-center gap-2 text-blackOlive hover:text-moradoSecundario transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span className="hidden sm:inline">Editar Perfil</span>
            </Link>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-blackOlive hover:text-red-600"
            >
              <LogOut className="h-5 w-5 sm:mr-2" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold text-blackOlive mb-4 font-kawaiiRT">
              ¡Bienvenido{user?.first_name ? `, ${user.first_name}` : ""}!
            </h1>
            <p className="text-xl text-blackOlive/70">
              Gracias por ser parte de Tijuanita Mi Ciudad
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-4 border-green-500/20 bg-green-50/10 backdrop-blur-lg shadow-2xl rounded-3xl">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                  <Globe className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl font-bold text-blackOlive">
                  Editar Sitio Web
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blackOlive/70 text-center mb-6">
                  Gestiona el contenido de la página de inicio
                </p>
                <Link to="/site-builder">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white hover:opacity-90">
                    Abrir Editor
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-4 border-blue-500/20 bg-blue-50/10 backdrop-blur-lg shadow-2xl rounded-3xl">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-bold text-blackOlive">
                  Gestionar Formularios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blackOlive/70 text-center mb-6">
                  Crea y administra formularios públicos
                </p>
                <Link to="/inicio/formularios">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:opacity-90">
                    Ver Formularios
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-4 border-white/20 bg-white/10 backdrop-blur-lg shadow-2xl rounded-3xl">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-moradoSecundario/20 flex items-center justify-center mb-4">
                  <User className="w-8 h-8 text-moradoSecundario" />
                </div>
                <CardTitle className="text-xl font-bold text-blackOlive">
                  Mi Perfil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blackOlive/70 text-center mb-6">
                  Actualiza tu información personal
                </p>
                <Link to="/profile">
                  <Button className="w-full bg-gradient-to-r from-moradoSecundario to-[#0a33ff] text-white hover:opacity-90">
                    Editar Perfil
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {user?.is_staff && (
              <Card className="border-4 border-purple-500/20 bg-purple-50/10 backdrop-blur-lg shadow-2xl rounded-3xl">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-blackOlive">
                    Gestionar Usuarios
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blackOlive/70 text-center mb-6">
                    Administra usuarios de la plataforma
                  </p>
                  <Link to="/inicio/usuarios">
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:opacity-90">
                      Ver Usuarios
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            <Card className="border-4 border-white/20 bg-white/10 backdrop-blur-lg shadow-2xl rounded-3xl">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-[#FDE047]/20 flex items-center justify-center mb-4">
                  <span className="text-3xl">🏠</span>
                </div>
                <CardTitle className="text-xl font-bold text-blackOlive">
                  Anuncios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blackOlive/70 text-center mb-6">
                  Anuncios y comunicación interna
                </p>
                <Button
                  className="w-full bg-gradient-to-r from-[#FDE047] to-[#f59e0b] text-blackOlive hover:opacity-90"
                  disabled
                >
                  Coming Soon
                </Button>
              </CardContent>
            </Card>

            <Card className="border-4 border-amber-500/20 bg-amber-50/10 backdrop-blur-lg shadow-2xl rounded-3xl">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mb-4">
                  <Lock className="w-8 h-8 text-amber-600" />
                </div>
                <CardTitle className="text-xl font-bold text-blackOlive">
                  Formularios Internos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blackOlive/70 text-center mb-6">
                  Formularios para voluntarios y personal administrativo
                </p>
                <Link to="/formularios-internos">
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90">
                    Ver Formularios
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>

      <AppFooter />
    </div>
  );
};

export default SimpleDashboard;

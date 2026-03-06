import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  CheckCircle,
  AlertCircle,
  Mail,
  ArrowRight,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/context/useAuth";
import AppFooter from "@/components/AppFooter";

const MagicLinkPage: React.FC = () => {
  const { authenticateMagicLink, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError("Enlace mágico inválido. No se encontró token.");
      setStatus("error");
    }
  }, [searchParams]);

  useEffect(() => {
    const authenticate = async () => {
      if (!token || status !== "idle") return;

      setStatus("loading");

      try {
        const success = await authenticateMagicLink(token);

        if (success) {
          setStatus("success");
          setTimeout(() => {
            const redirectParam = searchParams.get("redirect");
            const redirectUrl = redirectParam ? decodeURIComponent(redirectParam) : "/inicio";
            navigate(redirectUrl, { replace: true });
          }, 2000);
        } else {
          throw new Error("La autenticación con enlace mágico falló");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Autenticación fallida");
        setStatus("error");
      }
    };

    if (token) {
      authenticate();
    }
  }, [token, navigate, searchParams, status, authenticateMagicLink]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-blancoHuesoFondo flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('/images/textures/noise.jpg')] opacity-10 mix-blend-soft-light" />

      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[10%] top-[15%] h-40 w-40 rounded-full bg-[#fde047]/20 blur-xl"
      />

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-flex items-center justify-center mb-6">
            <img
              src="/images/landing/navbar2.png"
              alt="Tijuanita Mi Ciudad"
              className="h-16 w-auto"
            />
          </Link>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-blackOlive mb-4 font-kawaiiRT"
          >
            <span className="bg-gradient-to-r from-moradoSecundario to-[#0a33ff] bg-clip-text text-transparent">
              Autenticación
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-blackOlive/70 text-sm sm:text-base"
          >
            Acceso seguro a tu cuenta
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-4 border-white/20 bg-white/10 backdrop-blur-lg shadow-2xl rounded-3xl">
            <CardHeader className="text-center pb-4">
              <AnimatePresence mode="wait">
                {status === "loading" && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <div className="mx-auto w-20 h-20 rounded-full bg-moradoSecundario/20 flex items-center justify-center mb-4">
                      <div className="w-10 h-10 border-4 border-moradoSecundario/30 border-t-moradoSecundario rounded-full animate-spin" />
                    </div>
                    <CardTitle className="text-xl font-bold text-blackOlive">
                      Verificando...
                    </CardTitle>
                    <CardDescription className="text-blackOlive/70 mt-2">
                      Por favor espera mientras verificamos tu enlace
                    </CardDescription>
                  </motion.div>
                )}

                {status === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <CardTitle className="text-xl font-bold text-green-600">
                      ¡Acceso Concedido!
                    </CardTitle>
                    <CardDescription className="text-blackOlive/70 mt-2">
                      Redireccionando a tu dashboard...
                    </CardDescription>
                  </motion.div>
                )}

                {status === "error" && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <div className="mx-auto w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
                      <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <CardTitle className="text-xl font-bold text-red-600">
                      Autenticación Fallida
                    </CardTitle>
                    <CardDescription className="text-blackOlive/70 mt-2">
                      {error || "Tuvimos un problema con tu enlace mágico"}
                    </CardDescription>
                  </motion.div>
                )}

                {status === "idle" && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <div className="mx-auto w-20 h-20 rounded-full bg-moradoSecundario/20 flex items-center justify-center mb-4">
                      <Mail className="w-10 h-10 text-moradoSecundario" />
                    </div>
                    <CardTitle className="text-xl font-bold text-blackOlive">
                      Procesando Enlace
                    </CardTitle>
                    <CardDescription className="text-blackOlive/70 mt-2">
                      Extrayendo token de la URL...
                    </CardDescription>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardHeader>

            {status === "error" && (
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-700 mb-3">
                      Pasos para solucionar:
                    </p>
                    <ul className="text-xs text-red-600 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-moradoSecundario font-bold">1.</span>
                        Verifica tu carpeta de spam
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-moradoSecundario font-bold">2.</span>
                        Asegúrate de usar el enlace más reciente
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-moradoSecundario font-bold">3.</span>
                        Los enlaces expiran después de 24 horas
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      onClick={() => navigate("/login")}
                      className="flex-1 border-gray-300 text-blackOlive hover:bg-gray-100"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Volver
                    </Button>
                    <Button
                      onClick={() => navigate("/login")}
                      className="flex-1 bg-gradient-to-r from-moradoSecundario to-[#0a33ff] text-white hover:opacity-90"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Solicitar Nuevo Enlace
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 text-center"
        >
        </motion.div>
      </div>
      </div>

      <AppFooter />
    </div>
  );
};

export default MagicLinkPage;

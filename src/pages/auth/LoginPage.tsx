import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Mail,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import { toast } from "sonner";
import AppFooter from "@/components/AppFooter";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (email.length === 0) {
      setEmailValid(null);
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailValid(emailRegex.test(email));
    }
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!emailValid) {
      setError("Por favor ingresa un correo electrónico válido");
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(email);
      
      if (result.success) {
        setSuccess("¡Correo enviado! Revisa tu bandeja de entrada");
        toast.success("Magic link enviado a tu correo");
      } else {
        setError(result.message || "Error al enviar el magic link");
        toast.error(result.message || "Error al enviar el magic link");
      }
    } catch (err) {
      setError("Ocurrió un error inesperado");
      toast.error("Ocurrió un error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-blancoHuesoFondo flex flex-col">
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

      <motion.div
        animate={{
          y: [0, -40, 0],
          rotate: [0, 45, 90, 135, 180],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[15%] top-[25%] h-24 w-24 bg-[#FF6B6B]/30 blur-lg"
      />

      <div className="flex-1 flex items-center justify-center p-4">
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
              Iniciar Sesión
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-blackOlive/70 text-sm sm:text-base"
          >
            Acceso seguro sin contraseña mediante enlace mágico
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-4 border-white/20 bg-white/10 backdrop-blur-lg shadow-2xl rounded-3xl">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-moradoSecundario/20 flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-moradoSecundario" />
              </div>
              <CardTitle className="text-xl font-bold text-blackOlive">
                Ingresa tu correo electrónico
              </CardTitle>
              <CardDescription className="text-blackOlive/70">
                Te enviaremos un enlace de acceso seguro
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <label htmlFor="email" className="sr-only">
                    Correo electrónico
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-moradoSecundario/20 to-[#0a33ff]/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blackOlive/50 group-focus-within:text-moradoSecundario transition-colors" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@correo.com"
                        required
                        autoFocus
                        className="bg-white/50 border-gray-200 text-blackOlive placeholder:text-blackOlive/50 h-14 rounded-xl pl-12 pr-4 focus:ring-2 focus:ring-moradoSecundario"
                        aria-describedby="email-hint"
                      />
                      {emailValid === true && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                      )}
                      {emailValid === false && email.length > 0 && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        </div>
                      )}
                    </div>
                  </div>
                  <p id="email-hint" className="text-xs text-blackOlive/50 mt-2">
                    Ingresa un correo electrónico válido para recibir el enlace
                  </p>
                </div>

                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 bg-green-50 border border-green-200 rounded-xl"
                      role="status"
                      aria-live="polite"
                    >
                      <div className="flex items-center gap-2 text-green-700 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        {success}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 bg-red-50 border border-red-200 rounded-xl"
                      role="alert"
                      aria-live="assertive"
                    >
                      <div className="flex items-center gap-2 text-red-700 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  disabled={isLoading || !email || !emailValid}
                  aria-busy={isLoading}
                  className="w-full h-14 rounded-xl bg-gradient-to-r from-moradoSecundario to-[#0a33ff] text-white font-semibold text-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Enviando...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Enviar Enlace de Acceso
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>

                <p className="text-center text-sm text-blackOlive/70">
                  ¿No tienes una cuenta?{" "}
                  <Link
                    to="/registro"
                    className="text-moradoSecundario hover:underline font-medium"
                  >
                    Regístrate aquí
                  </Link>
                </p>
              </form>
            </CardContent>
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

export default LoginPage;

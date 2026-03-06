import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { API_BASE_URL } from "@/config";
import AppFooter from "@/components/AppFooter";

const PasswordResetPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError("Token de recuperación inválido");
    }
  }, [searchParams]);

  const passwordValid = React.useMemo(() => {
    if (password.length === 0) return null;
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    return hasMinLength && hasUpperCase && hasLowerCase && hasNumbers;
  }, [password]);

  const passwordMatch = React.useMemo(() => {
    if (password2.length === 0) return null;
    return password === password2;
  }, [password, password2]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    if (!token) {
      setError("Token de recuperación inválido");
      setIsLoading(false);
      return;
    }

    if (passwordValid === false) {
      setError("La contraseña no cumple los requisitos");
      setIsLoading(false);
      return;
    }

    if (passwordMatch === false) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/account/password-reset/confirm/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
          password2,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("¡Contraseña restablecida exitosamente!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(data.error || data.message || "Error al restablecer la contraseña");
      }
    } catch (error) {
      setError("Error de red. Verifica tu conexión.");
    } finally {
      setIsLoading(false);
    }
  };

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
              Nueva Contraseña
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-blackOlive/70 text-sm sm:text-base"
          >
            Ingresa tu nueva contraseña
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
                <Lock className="w-8 h-8 text-moradoSecundario" />
              </div>
              <CardTitle className="text-xl font-bold text-blackOlive">
                Restablecer Contraseña
              </CardTitle>
              <CardDescription className="text-blackOlive/70">
                Ingresa tu nueva contraseña
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-blackOlive mb-2">
                    Nueva Contraseña
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      required
                      className="bg-white/50 border-gray-200 text-blackOlive h-12 rounded-xl pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-blackOlive/50 hover:text-blackOlive"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {password.length > 0 && (
                    <div className="mt-2 text-xs space-y-1">
                      <div className={`flex items-center gap-1 ${password.length >= 8 ? "text-green-600" : "text-blackOlive/50"}`}>
                        {password.length >= 8 ? "✓" : "○"} 8+ caracteres
                      </div>
                      <div className={`flex items-center gap-1 ${/[A-Z]/.test(password) ? "text-green-600" : "text-blackOlive/50"}`}>
                        {/[A-Z]/.test(password) ? "✓" : "○"} Mayúscula
                      </div>
                      <div className={`flex items-center gap-1 ${/[a-z]/.test(password) ? "text-green-600" : "text-blackOlive/50"}`}>
                        {/[a-z]/.test(password) ? "✓" : "○"} Minúscula
                      </div>
                      <div className={`flex items-center gap-1 ${/\d/.test(password) ? "text-green-600" : "text-blackOlive/50"}`}>
                        {/\d/.test(password) ? "✓" : "○"} Número
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="password2" className="block text-sm font-medium text-blackOlive mb-2">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <Input
                      id="password2"
                      type={showPassword2 ? "text" : "password"}
                      value={password2}
                      onChange={(e) => setPassword2(e.target.value)}
                      placeholder="Repite tu contraseña"
                      required
                      className="bg-white/50 border-gray-200 text-blackOlive h-12 rounded-xl pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword2(!showPassword2)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-blackOlive/50 hover:text-blackOlive"
                    >
                      {showPassword2 ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {password2.length > 0 && (
                    <p className={`mt-2 text-xs ${passwordMatch ? "text-green-600" : "text-red-500"}`}>
                      {passwordMatch ? "✓ Las contraseñas coinciden" : "○ Las contraseñas no coinciden"}
                    </p>
                  )}
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
                  disabled={isLoading || !password || !password2 || !passwordValid || !passwordMatch}
                  className="w-full h-14 rounded-xl bg-gradient-to-r from-moradoSecundario to-[#0a33ff] text-white font-semibold text-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Restableciendo...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Restablecer Contraseña
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-blackOlive/70 hover:text-moradoSecundario transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Volver a Iniciar Sesión
                  </Link>
                </div>
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
          <p className="text-xs text-blackOlive/50">
            © {new Date().getFullYear()} Tijuanita Mi Ciudad. Todos los derechos reservados.
          </p>
        </motion.div>
      </div>
      </div>

      <AppFooter />
    </div>
  );
};

export default PasswordResetPage;

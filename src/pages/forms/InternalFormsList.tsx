import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, ClipboardList, Sparkles, ArrowRight, CheckCircle, X, Lock } from "lucide-react";
import { formsService } from "@/services/formsService";
import type { PublicForm } from "@/types/forms";
import AppFooter from "@/components/AppFooter";

const cardGradients = [
  "from-amber-light to-amber/10",
  "from-orange-light to-orange/10",
  "from-yellow-light to-yellow/10",
  "from-peach-light to-peach/10",
  "from-sunny-light to-sunny/10",
];

const iconColors = [
  "bg-amber-light text-amber-600",
  "bg-orange-100 text-orange-600",
  "bg-yellow-100 text-yellow-600",
  "bg-peach-light text-peach-dark",
  "bg-orange-100 text-orange-700",
];

const buttonGradients = [
  "from-amber-700 to-amber-800",
  "from-orange-700 to-orange-800",
  "from-yellow-700 to-yellow-800",
  "from-amber-600 to-orange-700",
  "from-orange-600 to-yellow-700",
];

const InternalFormsList: React.FC = () => {
  const [forms, setForms] = useState<PublicForm[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadForms = async () => {
    try {
      const data = await formsService.listInternalForms();
      setForms(data);
    } catch (error) {
      toast.error("Error al cargar formularios internos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForms();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-warmBg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-slate-200"></div>
            <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-slate-500 font-medium">Cargando formularios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warmBg flex flex-col">
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/images/landing/navbar2.png"
              alt="Tijuanita Mi Ciudad"
              className="h-10 w-auto"
            />
          </Link>
          <Link to="/inicio">
            <Button variant="outline" className="border-amber-500 text-amber-600 hover:bg-amber-50">
              Volver al Panel
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-light mb-6">
              <Lock className="w-10 h-10 text-amber-600" />
            </div>
            <h1 className="text-4xl font-bold text-charcoal mb-4 font-kawaiiRT">
              Formularios Internos
            </h1>
            <p className="text-xl text-slate-500">
              Formularios para voluntarios y personal administrativo
            </p>
          </div>

          {forms.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
                <ClipboardList className="w-12 h-12 text-slate-400" />
              </div>
              <p className="text-slate-600 text-lg mb-2">
                No hay formularios internos disponibles
              </p>
              <p className="text-slate-400">
                Contacta al administrador para más información
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {forms.map((form, index) => (
                <motion.div
                  key={form.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`h-full border-0 bg-gradient-to-br ${cardGradients[index % cardGradients.length]} shadow-xl rounded-3xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden`}
                  >
                    <div className="h-1.5 bg-gradient-to-r from-amber via-orange to-yellow"></div>
                    <CardHeader className="text-center pb-4 pt-8">
                      <div className={`mx-auto w-16 h-16 rounded-2xl ${iconColors[index % iconColors.length]} flex items-center justify-center mb-4 shadow-lg`}>
                        <FileText className="w-8 h-8" />
                      </div>
                      <CardTitle className="text-xl font-bold text-charcoal">
                        {form.name}
                      </CardTitle>
                      {form.description && (
                        <CardDescription className="text-slate-500 mt-2">
                          {form.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center gap-2 mb-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/80 text-sm font-medium text-slate-600">
                          {form.questions?.length || 0} preguntas
                        </span>
                      </div>
                      <Link to={`/formularios-internos/${form.slug}`}>
                        <Button 
                          className={`w-full ${buttonGradients[index % buttonGradients.length]} text-stone-800 hover:opacity-90 shadow-xl border-2 border-white/20 font-semibold`}
                        >
                          Responder
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      <AppFooter />
    </div>
  );
};

export default InternalFormsList;

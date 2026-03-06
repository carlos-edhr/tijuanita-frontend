import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Send, Loader2, Sparkles, CheckCircle, XCircle, AlertCircle, FileQuestion, Check, Lock } from "lucide-react";
import { formsService } from "@/services/formsService";
import type { PublicForm, Question, AnswerSubmission } from "@/types/forms";
import AppFooter from "@/components/AppFooter";
import { useAuth } from "@/context/useAuth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ValidationState {
  touched: boolean;
  valid: boolean | null;
  message: string | null;
}

interface FormAnswers {
  [questionId: number]: string;
}

interface ValidationStore {
  [questionId: number]: ValidationState;
}

const questionColors = [
  "border-l-amber bg-amber-light/30",
  "border-l-orange bg-orange-light/30",
  "border-l-yellow bg-yellow-light/30",
  "border-l-peach bg-peach-light/30",
  "border-l-sunny bg-sunny-light/30",
];

const ValidationIcon: React.FC<{ valid: boolean | null; touched: boolean }> = ({ valid, touched }) => {
  if (!touched || valid === null) return null;
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="absolute right-3 top-1/2 -translate-y-1/2"
      >
        {valid ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <XCircle className="w-5 h-5 text-red-500" />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

const InternalFormView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { authToken } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<PublicForm | null>(null);
  const [answers, setAnswers] = useState<FormAnswers>({});
  const [validation, setValidation] = useState<ValidationStore>({});
  const [focusedField, setFocusedField] = useState<number | null>(null);
  const [, setErrorFields] = useState<number[]>([]);

  const loadForm = useCallback(async () => {
    try {
      const data = await formsService.getPublicForm(slug!);
      setForm(data);
      const initialValidation: ValidationStore = {};
      data.questions.forEach((q) => {
        initialValidation[q.id] = { touched: false, valid: null, message: null };
      });
      setValidation(initialValidation);
    } catch (_error) {
      toast.error("Formulario no encontrado");
      navigate("/formularios-internos");
    } finally {
      setLoading(false);
    }
  }, [slug, navigate]);

  useEffect(() => {
    if (slug) {
      loadForm();
    }
  }, [slug, loadForm]);

  const validateField = useCallback((question: Question, value: string): { valid: boolean; message: string | null } => {
    if (question.is_required && !value.trim()) {
      return { valid: false, message: "Este campo es requerido" };
    }

    if (!value.trim()) {
      return { valid: true, message: null };
    }

    switch (question.answer_type) {
      case "email":
        if (!EMAIL_REGEX.test(value)) {
          return { valid: false, message: "Ingresa un correo electrónico válido" };
        }
        return { valid: true, message: "Correo válido" };

      case "number": {
        const num = parseFloat(value);
        if (isNaN(num)) {
          return { valid: false, message: "Ingresa un número válido" };
        }
        if (question.allow_only_positive && num < 0) {
          return { valid: false, message: "Solo se permiten números positivos" };
        }
        if (question.min_value !== null && num < question.min_value) {
          return { valid: false, message: `El valor mínimo es ${question.min_value}` };
        }
        if (question.max_value !== null && num > question.max_value) {
          return { valid: false, message: `El valor máximo es ${question.max_value}` };
        }
        return { valid: true, message: null };
      }

      case "text":
      case "long_text":
        if (question.max_length && value.length > question.max_length) {
          return { valid: false, message: `Máximo ${question.max_length} caracteres` };
        }
        return { valid: true, message: null };

      default:
        return { valid: true, message: null };
    }
  }, []);

  const handleAnswerChange = (questionId: number, value: string) => {
    const question = form?.questions.find(q => q.id === questionId);
    if (!question) return;

    let processedValue = value;

    if (question.answer_type === "number") {
      processedValue = value.replace(/[^0-9.-]/g, "");
      if (question.allow_only_positive) {
        processedValue = processedValue.replace(/-/g, "");
      }
    }

    setAnswers(prev => ({ ...prev, [questionId]: processedValue }));

    const validationResult = validateField(question, processedValue);
    setValidation(prev => ({
      ...prev,
      [questionId]: {
        ...validationResult,
        touched: true
      }
    }));
  };

  const handleBlur = (questionId: number) => {
    const question = form?.questions.find(q => q.id === questionId);
    if (!question) return;

    const value = answers[questionId] || "";
    const validationResult = validateField(question, value);

    setValidation(prev => ({
      ...prev,
      [questionId]: {
        ...validationResult,
        touched: true
      }
    }));
    setFocusedField(null);
  };

  const allValid = useMemo(() => {
    if (!form) return false;
    
    for (const question of form.questions) {
      const value = answers[question.id] || "";
      const { valid } = validateField(question, value);
      
      if (!valid) return false;
    }
    return true;
  }, [form, answers, validateField]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!allValid) {
      const newValidation: ValidationStore = {};
      const newErrorFields: number[] = [];
      
      form?.questions.forEach(question => {
        const value = answers[question.id] || "";
        const { valid, message } = validateField(question, value);
        
        newValidation[question.id] = {
          touched: true,
          valid,
          message
        };
        
        if (!valid) {
          newErrorFields.push(question.id);
        }
      });
      
      setValidation(newValidation);
      setErrorFields(newErrorFields);
      
      toast.error("Por favor completa todos los campos requeridos correctamente");
      return;
    }

    setSubmitting(true);

    try {
      const submission: AnswerSubmission[] = Object.entries(answers).map(([questionId, value]) => ({
        question_id: parseInt(questionId),
        value
      }));

      await formsService.submitForm(slug!, submission);
      
      toast.success("Formulario enviado correctamente", {
        description: "Gracias por tu participación. Puedes ver más formularios en la lista.",
        action: {
          label: "Ver más formularios",
          onClick: () => navigate("/formularios-internos"),
        },
      });
      navigate(`/formularios-internos?submitted=true&formName=${encodeURIComponent(form?.name || "")}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al enviar el formulario";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warmBg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-slate-200"></div>
            <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-slate-500 font-medium">Cargando formulario...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return null;
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
          <Link to="/formularios-internos">
            <Button variant="outline" className="border-amber-500 text-amber-600 hover:bg-amber-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Formularios Internos
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-0 bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-amber via-orange to-yellow"></div>
            <CardHeader className="text-center pb-2 pt-8">
              <div className="mx-auto w-16 h-16 rounded-full bg-amber-light flex items-center justify-center mb-4 shadow-lg">
                <Lock className="w-8 h-8 text-amber-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-charcoal">
                {form.name}
              </CardTitle>
              {form.description && (
                <CardDescription className="text-slate-500 mt-2 text-base">
                  {form.description}
                </CardDescription>
              )}
              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-sm font-medium text-amber-700">
                  {form.questions?.length || 0} preguntas
                </span>
                {authToken && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-sm font-medium text-green-700">
                    <Check className="w-3 h-3 mr-1" />
                    Autenticado
                  </span>
                )}
              </div>
            </CardHeader>

            <CardContent className="pt-4 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {form.questions
                  .sort((a, b) => a.order - b.order)
                  .map((question, index) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`relative rounded-r-xl ${questionColors[index % questionColors.length]} border-l-4 p-4 pl-5`}
                    >
                      <Label
                        htmlFor={`question-${question.id}`}
                        className="block text-base font-semibold text-charcoal mb-2"
                      >
                        {question.question_text}
                        {question.is_required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      
                      {question.hint && (
                        <p className="text-sm text-slate-500 mb-2">{question.hint}</p>
                      )}

                      {question.answer_type === "text" && (
                        <div className="relative">
                          <Input
                            id={`question-${question.id}`}
                            type="text"
                            value={answers[question.id] || ""}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            onFocus={() => setFocusedField(question.id)}
                            onBlur={() => handleBlur(question.id)}
                            placeholder="Tu respuesta..."
                            className={`pr-10 ${validation[question.id]?.touched && validation[question.id]?.valid === false ? "border-red-500 focus:border-red-500" : ""}`}
                            maxLength={question.max_length || undefined}
                          />
                          <ValidationIcon
                            valid={validation[question.id]?.valid}
                            touched={validation[question.id]?.touched || false}
                          />
                        </div>
                      )}

                      {question.answer_type === "long_text" && (
                        <div className="relative">
                          <Textarea
                            id={`question-${question.id}`}
                            value={answers[question.id] || ""}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            onFocus={() => setFocusedField(question.id)}
                            onBlur={() => handleBlur(question.id)}
                            placeholder="Tu respuesta..."
                            className={`min-h-[120px] ${validation[question.id]?.touched && validation[question.id]?.valid === false ? "border-red-500 focus:border-red-500" : ""}`}
                            maxLength={question.max_length || undefined}
                          />
                          {question.max_length && (
                            <div className="text-right text-xs text-slate-400 mt-1">
                              {(answers[question.id]?.length || 0)}/{question.max_length}
                            </div>
                          )}
                        </div>
                      )}

                      {question.answer_type === "email" && (
                        <div className="relative">
                          <Input
                            id={`question-${question.id}`}
                            type="email"
                            value={answers[question.id] || ""}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            onFocus={() => setFocusedField(question.id)}
                            onBlur={() => handleBlur(question.id)}
                            placeholder="tu@email.com"
                            className={`pr-10 ${validation[question.id]?.touched && validation[question.id]?.valid === false ? "border-red-500 focus:border-red-500" : ""}`}
                          />
                          <ValidationIcon
                            valid={validation[question.id]?.valid}
                            touched={validation[question.id]?.touched || false}
                          />
                        </div>
                      )}

                      {question.answer_type === "number" && (
                        <div className="relative">
                          <Input
                            id={`question-${question.id}`}
                            type="text"
                            inputMode="decimal"
                            value={answers[question.id] || ""}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            onFocus={() => setFocusedField(question.id)}
                            onBlur={() => handleBlur(question.id)}
                            placeholder="0"
                            className={`pr-10 ${validation[question.id]?.touched && validation[question.id]?.valid === false ? "border-red-500 focus:border-red-500" : ""}`}
                          />
                          <ValidationIcon
                            valid={validation[question.id]?.valid}
                            touched={validation[question.id]?.touched || false}
                          />
                        </div>
                      )}

                      {question.answer_type === "select" && (
                        <Select
                          value={answers[question.id] || ""}
                          onValueChange={(value) => handleAnswerChange(question.id, value)}
                        >
                          <SelectTrigger className={`${validation[question.id]?.touched && validation[question.id]?.valid === false ? "border-red-500 focus:border-red-500" : ""}`}>
                            <SelectValue placeholder="Selecciona una opción" />
                          </SelectTrigger>
                          <SelectContent>
                            {question.options?.map((option, idx) => (
                              <SelectItem key={idx} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {question.answer_type === "checkbox" && (
                        <div className="space-y-2">
                          {question.options?.map((option, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <Checkbox
                                id={`question-${question.id}-option-${idx}`}
                                checked={(answers[question.id] || "").split(",").includes(option)}
                                onCheckedChange={(checked) => {
                                  const currentValues = (answers[question.id] || "").split(",").filter(Boolean);
                                  let newValues: string[];
                                  
                                  if (checked) {
                                    newValues = [...currentValues, option];
                                  } else {
                                    newValues = currentValues.filter(v => v !== option);
                                  }
                                  
                                  handleAnswerChange(question.id, newValues.join(","));
                                }}
                              />
                              <Label
                                htmlFor={`question-${question.id}-option-${idx}`}
                                className="text-sm text-slate-700 cursor-pointer"
                              >
                                {option}
                              </Label>
                            </div>
                          ))}
                        </div>
                      )}

                      {validation[question.id]?.touched && validation[question.id]?.message && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`text-sm mt-1 ${validation[question.id]?.valid ? "text-green-600" : "text-red-500"}`}
                        >
                          {validation[question.id]?.message}
                        </motion.p>
                      )}
                    </motion.div>
                  ))}

                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:opacity-90 shadow-xl font-semibold py-6 text-lg"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Enviar Formulario
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <AppFooter />
    </div>
  );
};

export default InternalFormView;

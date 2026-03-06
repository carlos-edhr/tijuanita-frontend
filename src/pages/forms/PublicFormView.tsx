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
import { ArrowLeft, Send, Loader2, Sparkles, CheckCircle, XCircle, AlertCircle, FileQuestion, Check } from "lucide-react";
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
  "border-l-coral bg-coral-light/30",
  "border-l-teal bg-teal-light/30",
  "border-l-sunny bg-sunny-light/30",
  "border-l-mint bg-mint-light/30",
  "border-l-peach bg-peach-light/30",
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

const PublicFormView: React.FC = () => {
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
      navigate("/formularios");
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
        touched: true,
        valid: validationResult.valid,
        message: validationResult.message
      }
    }));
  };

  const handleBlur = (questionId: number) => {
    const question = form?.questions.find(q => q.id === questionId);
    if (!question) return;

    setFocusedField(null);
    const value = answers[questionId] || "";
    const validationResult = validateField(question, value);
    
    setValidation(prev => ({
      ...prev,
      [questionId]: {
        touched: true,
        valid: validationResult.valid,
        message: validationResult.message
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    if (form.requires_auth && !authToken) {
      toast.error("Este formulario requiere autenticación");
      return;
    }

    const newErrorFields: number[] = [];
    const updatedValidation: ValidationStore = { ...validation };

    for (const question of form.questions) {
      const value = answers[question.id] || "";
      const validationResult = validateField(question, value);
      
      updatedValidation[question.id] = {
        touched: true,
        valid: validationResult.valid,
        message: validationResult.message
      };

      if (question.is_required && !value.trim()) {
        newErrorFields.push(question.id);
      } else if (!validationResult.valid && value.trim()) {
        newErrorFields.push(question.id);
      }
    }

    setValidation(updatedValidation);
    setErrorFields(newErrorFields);

    if (newErrorFields.length > 0) {
      toast.error("Por favor corrige los errores antes de enviar");
      const firstErrorField = document.getElementById(`question-${newErrorFields[0]}`);
      firstErrorField?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const answerList: AnswerSubmission[] = [];
    for (const question of form.questions) {
      const value = answers[question.id] || "";
      if (value) {
        answerList.push({
          question_id: question.id,
          value,
        });
      }
    }

    setSubmitting(true);
    
    const loadingToastId = toast.loading("Enviando formulario...", {
      description: "Por favor espera",
    });
    
    try {
      await formsService.submitForm(form.slug, answerList);
      
      toast.dismiss(loadingToastId);
      
      toast.success("¡Formulario enviado correctamente!", {
        description: "Gracias por tu participación. Puedes ver más formularios en la lista.",
        duration: 5000,
        action: {
          label: "Ver más formularios",
          onClick: () => navigate("/formularios"),
        },
      });
      navigate(`/formularios?submitted=true&formName=${encodeURIComponent(form.name)}`);
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error(error instanceof Error ? error.message : "Error al enviar formulario");
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestionInput = (question: Question) => {
    const value = answers[question.id] || "";
    const validationState = validation[question.id] || { touched: false, valid: null, message: null };
    const isFocused = focusedField === question.id;
    const hasError = validationState.touched && validationState.valid === false;
    const hasSuccess = validationState.touched && validationState.valid === true;

    const commonProps = {
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        handleAnswerChange(question.id, e.target.value),
      onFocus: () => setFocusedField(question.id),
      onBlur: () => handleBlur(question.id),
      placeholder: question.hint || undefined,
      id: `question-${question.id}`,
      "aria-invalid": hasError,
      "aria-describedby": hasError ? `error-${question.id}` : undefined,
    };

    const getBorderClass = () => {
      if (hasError) return "border-red-500 ring-2 ring-red-500/20 focus:border-red-500 focus:ring-red-500/30";
      if (hasSuccess) return "border-green-500 ring-2 ring-green-500/20 focus:border-green-500 focus:ring-green-500/30";
      if (isFocused) return "border-teal ring-2 ring-teal/20 focus:border-teal focus:ring-teal/30";
      return "border-slate-200 focus:border-teal focus:ring-teal/20";
    };

    switch (question.answer_type) {
      case "text":
        return (
          <div className="relative">
            <Input
              {...commonProps}
              maxLength={question.max_length || undefined}
              className={`${getBorderClass()} pr-10 transition-all`}
            />
            <ValidationIcon valid={validationState.valid} touched={validationState.touched} />
            {question.max_length && (
              <p className="text-xs text-slate-400 mt-1 text-right">
                {value.length}/{question.max_length}
              </p>
            )}
          </div>
        );
      case "long_text":
        return (
          <div className="relative">
            <Textarea
              {...commonProps}
              maxLength={question.max_length || undefined}
              rows={4}
              className={`${getBorderClass()} pr-10 resize-none transition-all`}
            />
            <ValidationIcon valid={validationState.valid} touched={validationState.touched} />
            {question.max_length && (
              <p className="text-xs text-slate-400 mt-1 text-right">
                {value.length}/{question.max_length}
              </p>
            )}
          </div>
        );
      case "email":
        return (
          <div className="relative">
            <Input
              type="email"
              {...commonProps}
              className={`${getBorderClass()} pr-10 transition-all`}
            />
            <ValidationIcon valid={validationState.valid} touched={validationState.touched} />
          </div>
        );
      case "number":
        return (
          <div className="relative">
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              {...commonProps}
              value={value}
              className={`${getBorderClass()} pr-10 transition-all`}
            />
            <ValidationIcon valid={validationState.valid} touched={validationState.touched} />
            {(question.min_value !== null || question.max_value !== null) && (
              <p className="text-xs text-slate-400 mt-1">
                Rango: {question.min_value !== null ? question.min_value : "sin mínimo"} - {question.max_value !== null ? question.max_value : "sin máximo"}
              </p>
            )}
          </div>
        );
      case "select":
        return (
          <Select
            value={value}
            onValueChange={(val) => handleAnswerChange(question.id, val)}
          >
            <SelectTrigger className={`bg-white ${getBorderClass()} transition-all`}>
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 max-h-60">
              {(question.options || []).map((option, idx) => (
                <SelectItem
                  key={idx}
                  value={option}
                  className="text-charcoal focus:bg-teal-light focus:text-charcoal cursor-pointer"
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "checkbox":
        return (
          <div className="space-y-3">
            {(question.options || []).map((option, idx) => {
              const currentValues = value.split(",").filter(Boolean);
              const isChecked = currentValues.includes(option);
              return (
                <div 
                  key={idx}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <Checkbox
                    id={`${question.id}-${idx}`}
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      let newValues = currentValues;
                      if (checked) {
                        newValues = [...currentValues, option];
                      } else {
                        newValues = currentValues.filter((v) => v !== option);
                      }
                      handleAnswerChange(question.id, newValues.join(","));
                    }}
                    className="border-slate-300 data-[state=checked]:bg-teal data-[state=checked]:border-teal"
                  />
                  <Label htmlFor={`${question.id}-${idx}`} className="text-sm font-medium text-charcoal cursor-pointer">
                    {option}
                  </Label>
                </div>
              );
            })}
          </div>
        );
      default:
        return <Input {...commonProps} className={`${getBorderClass()} transition-all`} />;
    }
  };

  const progress = useMemo(() => {
    if (!form?.questions?.length) return 0;
    const answeredCount = Object.keys(answers).filter(
      k => answers[parseInt(k)]?.trim()
    ).length;
    return (answeredCount / form.questions.length) * 100;
  }, [form, answers]);

  if (loading) {
    return (
      <div className="min-h-screen bg-warmBg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-slate-200"></div>
            <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-coral border-t-transparent animate-spin"></div>
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/formularios">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-teal hover:bg-teal-light">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            {form.questions && form.questions.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-teal to-mint transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {Math.round(progress)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-xl border-slate-100 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-coral via-teal to-sunny"></div>
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-light flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-teal" />
              </div>
              <CardTitle className="text-3xl font-bold text-charcoal">
                {form.name}
              </CardTitle>
              {form.description && (
                <CardDescription className="text-slate-500 text-base mt-2">
                  {form.description}
                </CardDescription>
              )}
              {form.requires_auth && !authToken && (
                <div className="mt-6 p-4 bg-peach-light border border-peach/30 rounded-xl">
                  <p className="text-peach text-sm font-medium">
                    Este formulario requiere que inicies sesión para responder.
                    <Link to="/login" className="underline ml-1 hover:text-peach-dark">
                      Iniciar sesión
                    </Link>
                  </p>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {form.questions?.map((question, index) => {
                  const validationState = validation[question.id] || { touched: false, valid: null, message: null };
                  const hasError = validationState.touched && validationState.valid === false;
                  
                  return (
                    <motion.div 
                      key={question.id}
                      id={`question-container-${question.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-5 rounded-xl border-l-4 ${questionColors[index % questionColors.length]} transition-all hover:shadow-md ${hasError ? 'ring-2 ring-red-500/20' : ''}`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm font-bold text-teal shadow-sm">
                          {index + 1}
                        </span>
                        <Label className="text-base font-semibold text-charcoal pt-1">
                          {question.question_text}
                          {question.is_required && (
                            <span className="text-rose ml-1">*</span>
                          )}
                        </Label>
                      </div>
                      {question.hint && (
                        <p className="text-sm text-slate-500 ml-11 mb-3">{question.hint}</p>
                      )}
                      <div className="ml-11">
                        {renderQuestionInput(question)}
                      </div>
                      <AnimatePresence>
                        {hasError && validationState.message && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="ml-11 mt-2 flex items-center gap-2 text-red-500 text-sm"
                            id={`error-${question.id}`}
                            role="alert"
                          >
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {validationState.message}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}

                {form.questions?.length === 0 && (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                      <FileQuestion className="w-10 h-10 text-slate-400" />
                    </div>
                    <p className="text-slate-500 text-lg">
                      Este formulario no tiene preguntas aún.
                    </p>
                  </div>
                )}

                {form.questions && form.questions.length > 0 && (
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Button
                      type="submit"
                      disabled={submitting || (form.requires_auth && !authToken)}
                      className="w-full h-14 text-lg bg-gradient-to-r from-teal to-teal-dark hover:opacity-90 shadow-lg shadow-teal/25 transition-all"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Enviar formulario
                          {progress > 0 && (
                            <span className="ml-2 text-sm opacity-80">
                              <Check className="w-4 h-4 inline mr-1" />
                              {Math.round(progress)}% completo
                            </span>
                          )}
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <AppFooter />
    </div>
  );
};

export default PublicFormView;

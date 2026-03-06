import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate, useParams, useBlocker } from "react-router-dom";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import AppFooter from "@/components/AppFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  Save,
  Copy,
  Loader2,
  CheckCircle,
  Type,
  AlignLeft,
  Mail,
  Hash,
  ListChecks,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { formsService } from "@/services/formsService";
import type {
  Form,
  Question,
  CreateFormData,
  CreateQuestionData,
} from "@/types/forms";
import { ANSWER_TYPE_CHOICES, type AnswerType } from "@/types/forms";

const AUTOSAVE_DELAY_MS = 30000;

const emptyQuestion = (order: number): CreateQuestionData => ({
  question_text: "",
  answer_type: "text",
  options: [],
  hint: null,
  is_required: true,
  allow_only_positive: false,
  order,
});

const answerTypeIcons: Record<AnswerType, React.ReactNode> = {
  text: <Type className="w-4 h-4" />,
  long_text: <AlignLeft className="w-4 h-4" />,
  email: <Mail className="w-4 h-4" />,
  number: <Hash className="w-4 h-4" />,
  select: <ChevronDown className="w-4 h-4" />,
  checkbox: <ListChecks className="w-4 h-4" />,
};

const answerTypeColors: Record<AnswerType, string> = {
  text: "bg-coral-light text-coral border-coral/30",
  long_text: "bg-teal-light text-teal-dark border-teal/30",
  email: "bg-sunny-light text-sunny-dark border-sunny/30",
  number: "bg-mint-light text-mint border-mint/30",
  select: "bg-peach-light text-peach border-peach/30",
  checkbox: "bg-coral-light text-coral border-coral/30",
};

interface SortableQuestionProps {
  question: CreateQuestionData;
  index: number;
  total: number;
  onUpdate: (field: keyof CreateQuestionData, value: unknown) => void;
  onUpdateOption: (optionIndex: number, value: string) => void;
  onAddOption: () => void;
  onRemoveOption: (optionIndex: number) => void;
  onRemove: () => void;
  onDuplicate: () => void;
}

const SortableQuestion: React.FC<SortableQuestionProps> = ({
  question,
  index,
  total,
  onUpdate,
  onUpdateOption,
  onAddOption,
  onRemoveOption,
  onRemove,
  onDuplicate,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `question-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const typeColorClass = answerTypeColors[question.answer_type];

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`relative border-l-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        isDragging
          ? "shadow-2xl rotate-1 border-l-coral"
          : "shadow-md border-l-teal hover:border-l-coral"
      }`}
    >
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center gap-1">
            <button
              type="button"
              {...attributes}
              {...listeners}
              className="mt-1 cursor-grab active:cursor-grabbing p-2 rounded-lg hover:bg-coral-light text-slate-400 hover:text-coral transition-colors"
            >
              <GripVertical className="h-5 w-5" />
            </button>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              {index + 1}
            </span>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-charcoal">
                  Pregunta {index + 1}
                  <span className="text-slate-400 font-normal ml-1">de {total}</span>
                </span>
                {question.is_required && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-light text-rose">
                    Obligatoria
                  </span>
                )}
              </div>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onDuplicate}
                  className="h-8 w-8 p-0 text-slate-500 hover:text-coral hover:bg-coral-light"
                  title="Duplicar pregunta"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onRemove}
                  className="h-8 w-8 p-0 text-slate-500 hover:text-rose hover:bg-rose-light"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Input
              value={question.question_text}
              onChange={(e) => onUpdate("question_text", e.target.value)}
              placeholder="Escribe tu pregunta..."
              className="text-base font-medium border-slate-200 focus:border-coral focus:ring-coral/20"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-slate-600">Tipo de respuesta</Label>
                <Select
                  value={question.answer_type}
                  onValueChange={(value) =>
                    onUpdate("answer_type", value as AnswerType)
                  }
                >
                  <SelectTrigger className={`mt-1.5 border-slate-200 bg-white ${typeColorClass} border`}>
                    <div className="flex items-center gap-2">
                      {answerTypeIcons[question.answer_type]}
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    {ANSWER_TYPE_CHOICES.map((choice) => (
                      <SelectItem
                        key={choice.value}
                        value={choice.value}
                        className="text-charcoal focus:bg-coral-light focus:text-coral"
                      >
                        <div className="flex items-center gap-2">
                          {answerTypeIcons[choice.value]}
                          {choice.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-slate-600">Pista (hint)</Label>
                <Input
                  value={question.hint || ""}
                  onChange={(e) =>
                    onUpdate("hint", e.target.value || null)
                  }
                  placeholder="Pista para el usuario..."
                  className="mt-1.5 border-slate-200 focus:border-teal focus:ring-teal/20"
                />
              </div>
            </div>

            {(question.answer_type === "select" ||
              question.answer_type === "checkbox") && (
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                <Label className="text-sm font-medium text-slate-600">Opciones</Label>
                <div className="space-y-2 mt-2">
                  {(question.options || []).map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-coral-light text-coral flex items-center justify-center text-xs font-bold">
                        {optIndex + 1}
                      </div>
                      <Input
                        value={option}
                        onChange={(e) => onUpdateOption(optIndex, e.target.value)}
                        placeholder={`Opción ${optIndex + 1}`}
                        className="border-slate-200 focus:border-coral focus:ring-coral/20"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveOption(optIndex)}
                        className="shrink-0 text-slate-400 hover:text-rose hover:bg-rose-light"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onAddOption}
                    className="border-dashed border-coral/50 text-coral hover:bg-coral-light hover:border-coral"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar opción
                  </Button>
                </div>
              </div>
            )}

            {question.answer_type === "number" && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`positive-${index}`}
                  checked={question.allow_only_positive}
                  onCheckedChange={(checked) =>
                    onUpdate("allow_only_positive", checked as boolean)
                  }
                  className="border-slate-300 data-[state=checked]:bg-mint data-[state=checked]:border-mint"
                />
                <Label htmlFor={`positive-${index}`} className="text-sm font-normal text-slate-600">
                  Solo permitir números positivos
                </Label>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`required-${index}`}
                checked={question.is_required}
                onCheckedChange={(checked) =>
                  onUpdate("is_required", checked as boolean)
                }
                className="border-slate-300 data-[state=checked]:bg-coral data-[state=checked]:border-coral"
              />
              <Label htmlFor={`required-${index}`} className="text-sm font-normal text-slate-600">
                Pregunta requerida
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const FormEditor: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(slug);
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>("");
  const savingRef = useRef(false);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [formData, setFormData] = useState<CreateFormData>({
    name: "",
    requires_auth: false,
    is_active: true,
    description: null,
  });
  const [questions, setQuestions] = useState<CreateQuestionData[]>([]);
  const [currentFormSlug, setCurrentFormSlug] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const validateOptions = useCallback((options: string[]): string[] => {
    return options.filter((opt, idx, arr) => opt.trim() !== "" && arr.indexOf(opt) === idx);
  }, []);

  const loadForm = useCallback(async (formSlug: string) => {
    try {
      const form = await formsService.getForm(formSlug);
      const loadedFormData: CreateFormData = {
        name: form.name,
        requires_auth: form.requires_auth,
        is_active: form.is_active,
        description: form.description,
      };
      const loadedQuestions: CreateQuestionData[] = form.questions.map((q: Question) => ({
        id: q.id,
        question_text: q.question_text,
        answer_type: q.answer_type,
        options: q.options,
        hint: q.hint,
        is_required: q.is_required,
        allow_only_positive: q.allow_only_positive,
        order: q.order,
      }));
      
      setFormData(loadedFormData);
      setQuestions(loadedQuestions);
      setCurrentFormSlug(form.slug);
      lastSavedRef.current = JSON.stringify({ formData: loadedFormData, questions: loadedQuestions });
    } catch (_error) {
      toast.error("Error al cargar formulario");
      navigate("/inicio/formularios");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (isEditing && slug) {
      loadForm(slug);
    }
  }, [slug, isEditing, loadForm]);

  useEffect(() => {
    if (hasUnsavedChanges) {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
      autosaveTimerRef.current = setTimeout(() => {
        handleSaveRef.current?.(true);
      }, AUTOSAVE_DELAY_MS);
    }

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [hasUnsavedChanges, formData, questions]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  useBlocker(({ currentLocation, nextLocation }) => {
    return hasUnsavedChanges && currentLocation.pathname !== nextLocation.pathname;
  });

  const handleSaveRef = useRef<((isAutosave?: boolean) => Promise<void>) | null>(null);
  const addQuestionRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSaveRef.current?.();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "a" && e.target === document.body) {
        e.preventDefault();
        addQuestionRef.current?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSave = useCallback(async (isAutosave = false) => {
    if (savingRef.current) {
      return;
    }
    savingRef.current = true;

    if (!formData.name.trim()) {
      savingRef.current = false;
      if (!isAutosave) {
        toast.error("El nombre del formulario es requerido");
      }
      return;
    }

    if (!isAutosave) {
      setSaving(true);
    }

    try {
      let form: Form;
      const savedQuestions: CreateQuestionData[] = [];

      if (isEditing && currentFormSlug) {
        form = await formsService.updateForm(currentFormSlug, formData);
        if (form.slug !== currentFormSlug) {
          setCurrentFormSlug(form.slug);
          navigate(`/inicio/formularios/${form.slug}/editar`, { replace: true });
        }
      } else {
        form = await formsService.createForm(formData);
        setCurrentFormSlug(form.slug);
        navigate(`/inicio/formularios/${form.slug}/editar`, { replace: true });
      }

      const existingIds = new Set(
        questions.filter((q) => q.id).map((q) => q.id)
      );

      let existingQuestionsOnBackend: CreateQuestionData[] = [];
      if (isEditing && form.slug) {
        try {
          existingQuestionsOnBackend = await formsService.getFormQuestions(form.slug);
        } catch (e) {
          console.error("Error fetching existing questions:", e);
        }
      }

      const existingQuestionMap = new Map<string, CreateQuestionData>();
      for (const eq of existingQuestionsOnBackend) {
        if (eq.id) {
          existingQuestionMap.set(`id:${eq.id}`, eq);
        }
        const key = `${eq.question_text.trim().toLowerCase()}:${eq.answer_type}`;
        if (!existingQuestionMap.has(key)) {
          existingQuestionMap.set(key, eq);
        }
      }

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.question_text.trim()) continue;

        const questionToSave = {
          ...q,
          options: (q.answer_type === "select" || q.answer_type === "checkbox") 
            ? validateOptions(q.options || []) 
            : [],
        };

        if (q.id) {
          const updated = await formsService.updateQuestion(form.slug, q.id, questionToSave);
          savedQuestions.push({ ...q, id: updated.id });
        } else {
          const textKey = `${q.question_text.trim().toLowerCase()}:${q.answer_type}`;
          const existingMatch = existingQuestionMap.get(textKey);
          if (existingMatch && existingMatch.id) {
            await formsService.updateQuestion(form.slug, existingMatch.id, questionToSave);
            savedQuestions.push({ ...q, id: existingMatch.id });
          } else {
            const created = await formsService.addQuestion(form.slug, questionToSave);
            savedQuestions.push({ ...q, id: created.id });
          }
        }
      }

      const currentIds = new Set(questions.filter((q) => q.id).map((q) => q.id));
      const deletePromises: Promise<void>[] = [];
      
      for (const id of existingIds) {
        if (!currentIds.has(id)) {
          deletePromises.push(
            formsService.deleteQuestion(form.slug, id).catch((err) => {
              console.error(`Failed to delete question ${id}:`, err);
              throw err;
            })
          );
        }
      }

      if (deletePromises.length > 0) {
        await Promise.all(deletePromises);
      }

      const reorderedIds = savedQuestions
        .filter((q) => q.id)
        .map((q) => q.id as number);
      if (reorderedIds.length > 0) {
        await formsService.reorderQuestions(form.slug, reorderedIds);
      }

      setQuestions(savedQuestions);

      const currentData = JSON.stringify({ formData, questions: savedQuestions });
      lastSavedRef.current = currentData;
      setHasUnsavedChanges(false);
      setLastSaved(new Date());

      if (!isAutosave) {
        toast.success("Formulario guardado", {
          description: isEditing ? "Tus cambios han sido guardados" : "El formulario ha sido creado",
        });
      }
    } catch (error) {
      console.error("Error saving form:", error);
      if (!isAutosave) {
        toast.error("Error al guardar formulario");
      }
    } finally {
      savingRef.current = false;
      if (!isAutosave) {
        setSaving(false);
      }
    }
  }, [formData, questions, isEditing, currentFormSlug, navigate, validateOptions]);


  const handleFormDataChange = (field: keyof CreateFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const addQuestion = useCallback(() => {
    const newQuestion = emptyQuestion(questions.length);
    delete newQuestion.id;
    setQuestions([...questions, newQuestion]);
    setHasUnsavedChanges(true);
    toast.info("Nueva pregunta agregada", {
      description: "Guarda el formulario para persistir los cambios",
      duration: 2000,
    });
  }, [questions]);

  useEffect(() => {
    handleSaveRef.current = handleSave;
    addQuestionRef.current = addQuestion;
  }, [handleSave, addQuestion]);

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
    setHasUnsavedChanges(true);
  };

  const duplicateQuestion = (index: number) => {
    const original = questions[index];
    const { id: _id, ...rest } = original;
    const duplicate: CreateQuestionData = {
      ...rest,
      question_text: `${original.question_text} (copia)`,
    };
    delete duplicate.id;
    const updated = [...questions];
    updated.splice(index + 1, 0, duplicate);
    setQuestions(updated);
    setHasUnsavedChanges(true);
    toast.info("Pregunta duplicada", {
      description: "Guarda el formulario para persistir los cambios",
      duration: 2000,
    });
  };

  const updateQuestion = (index: number, field: keyof CreateQuestionData, value: unknown) => {
    const updated = [...questions];
    (updated[index] as Record<string, unknown>)[field] = value;

    if (field === "answer_type" && value !== "select" && value !== "checkbox") {
      updated[index].options = [];
    }

    setQuestions(updated);
    setHasUnsavedChanges(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = questions.findIndex(
        (_, i) => `question-${i}` === active.id
      );
      const newIndex = questions.findIndex(
        (_, i) => `question-${i}` === over.id
      );

      setQuestions(arrayMove(questions, oldIndex, newIndex));
      setHasUnsavedChanges(true);
      toast.info("Preguntas reordenadas", {
        description: "Guarda el formulario para persistir los cambios",
        duration: 2000,
      });
    }
  };

  const addOption = (questionIndex: number) => {
    const updated = [...questions];
    const currentOptions = updated[questionIndex].options || [];
    updated[questionIndex].options = [...currentOptions, ""];
    setQuestions(updated);
    setHasUnsavedChanges(true);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...questions];
    updated[questionIndex].options![optionIndex] = value;
    setQuestions(updated);
    setHasUnsavedChanges(true);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updated = [...questions];
    updated[questionIndex].options = updated[questionIndex].options!.filter(
      (_, i) => i !== optionIndex
    );
    setQuestions(updated);
    setHasUnsavedChanges(true);
  };

  const formatLastSaved = () => {
    if (!lastSaved) return null;
    const now = new Date();
    const diff = now.getTime() - lastSaved.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    
    if (minutes < 1) return "Guardado ahora";
    if (minutes === 1) return "Guardado hace 1 minuto";
    return `Guardado hace ${minutes} minutos`;
  };

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

  return (
    <div className="min-h-screen bg-warmBg flex flex-col">
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/inicio/formularios">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-coral hover:bg-coral-light">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-charcoal">
              {isEditing ? "Editar Formulario" : "Nuevo Formulario"}
            </h1>
            {hasUnsavedChanges && (
              <span className="inline-flex items-center gap-1.5 text-sm text-peach bg-peach-light px-3 py-1 rounded-full">
                <Sparkles className="w-3 h-3" />
                Sin guardar
              </span>
            )}
            {lastSaved && !hasUnsavedChanges && (
              <span className="inline-flex items-center gap-1.5 text-sm text-mint bg-mint-light px-3 py-1 rounded-full">
                <CheckCircle className="w-3 h-3" />
                {formatLastSaved()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 mr-2 hidden sm:inline flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px]">Ctrl+S</kbd> guardar
              <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] ml-1">Ctrl+A</kbd> pregunta
            </span>
            <Button
              onClick={() => handleSave()}
              disabled={saving}
              className="bg-gradient-to-r from-coral to-coral-dark text-white hover:opacity-90 shadow-lg shadow-coral/25"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full">
        <Card className="shadow-lg border-slate-100">
          <CardHeader className="bg-gradient-to-r from-coral-light to-transparent pb-4">
            <CardTitle className="text-charcoal flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-coral" />
              Información del Formulario
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-slate-600 font-medium">Nombre del formulario *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleFormDataChange("name", e.target.value)}
                placeholder="Ej: Encuesta de satisfacción"
                className="mt-1.5 border-slate-200 focus:border-coral focus:ring-coral/20 text-lg"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-slate-600 font-medium">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) =>
                  handleFormDataChange("description", e.target.value || null)
                }
                placeholder="Descripción opcional del formulario"
                className="mt-1.5 border-slate-200 focus:border-teal focus:ring-teal/20"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
              <div className="flex items-center space-x-2 bg-slate-50 px-3 py-2 rounded-lg">
                <Checkbox
                  id="requires_auth"
                  checked={formData.requires_auth}
                  onCheckedChange={(checked) =>
                    handleFormDataChange("requires_auth", checked as boolean)
                  }
                  className="border-slate-300 data-[state=checked]:bg-coral data-[state=checked]:border-coral"
                />
                <Label htmlFor="requires_auth" className="text-sm text-slate-600">
                  Requiere autenticación
                </Label>
              </div>

              <div className="flex items-center space-x-2 bg-slate-50 px-3 py-2 rounded-lg">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    handleFormDataChange("is_active", checked as boolean)
                  }
                  className="border-slate-300 data-[state=checked]:bg-mint data-[state=checked]:border-mint"
                />
                <Label htmlFor="is_active" className="text-sm text-slate-600">
                  Formulario activo
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-slate-100">
          <CardHeader className="bg-gradient-to-r from-teal-light to-transparent flex flex-row items-center justify-between">
            <CardTitle className="text-charcoal flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-teal" />
              Preguntas
              {questions.length > 0 && (
                <span className="ml-2 text-sm font-normal text-slate-500">
                  ({questions.length} {questions.length === 1 ? "pregunta" : "preguntas"})
                </span>
              )}
            </CardTitle>
            <Button 
              onClick={addQuestion} 
              variant="outline" 
              size="sm"
              className="border-coral text-coral hover:bg-coral-light hover:border-coral"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Pregunta
            </Button>
          </CardHeader>
          <CardContent>
            {questions.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-coral-light flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-coral" />
                </div>
                <p className="text-slate-600 text-lg mb-2">No hay preguntas aún</p>
                <p className="text-slate-400 mb-6">Agrega tu primera pregunta para comenzar</p>
                <Button 
                  onClick={addQuestion}
                  className="bg-gradient-to-r from-coral to-coral-dark text-white hover:opacity-90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Primera Pregunta
                </Button>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={questions.map((_, i) => `question-${i}`)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <SortableQuestion
                        key={`question-${index}`}
                        question={question}
                        index={index}
                        total={questions.length}
                        onUpdate={(field, value) =>
                          updateQuestion(index, field, value)
                        }
                        onUpdateOption={(optIndex, value) =>
                          updateOption(index, optIndex, value)
                        }
                        onAddOption={() => addOption(index)}
                        onRemoveOption={(optIndex) => removeOption(index, optIndex)}
                        onRemove={() => removeQuestion(index)}
                        onDuplicate={() => duplicateQuestion(index)}
                      />
                    ))}
                    
                    <Button
                      onClick={addQuestion}
                      variant="outline"
                      className="w-full mt-4 border-dashed border-2 border-coral/30 text-coral hover:bg-coral-light hover:border-coral"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      + Agregar Pregunta
                    </Button>
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </CardContent>
        </Card>
      </main>

      <AppFooter />
    </div>
  );
};

export default FormEditor;

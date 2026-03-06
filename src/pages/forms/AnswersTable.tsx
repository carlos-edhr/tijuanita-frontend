import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Download, FileText, Sparkles, MessageCircle } from "lucide-react";
import { formsService } from "@/services/formsService";
import type { Form, FormAnswer } from "@/types/forms";
import AppFooter from "@/components/AppFooter";

const AnswersTable: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Form | null>(null);
  const [answers, setAnswers] = useState<FormAnswer[]>([]);

  useEffect(() => {
    if (slug) {
      loadData();
    }
  }, [slug, loadData]);

  const loadData = useCallback(async () => {
    try {
      const [formData, answersData] = await Promise.all([
        formsService.getForm(slug!),
        formsService.getFormAnswers(slug!),
      ]);
      setForm(formData);
      setAnswers(answersData);
    } catch (error) {
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const escapeCSVValue = (value: string): string => {
    if (value === null || value === undefined) return "";
    const stringValue = String(value);
    if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n") || stringValue.includes("\r")) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const exportToCSV = () => {
    if (!form || answers.length === 0) return;

    const questions = form.questions || [];
    const headers = ["Fecha", ...questions.map((q) => q.question_text)];
    
    const rows = answers.map((answer) => {
      const submittedAt = new Date(answer.submitted_at).toLocaleString("es-MX");
      const values = questions.map((q) => {
        const val = answer.answers[q.question_text] || "";
        return escapeCSVValue(val);
      });
      return [escapeCSVValue(submittedAt), ...values].join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${form.slug}-respuestas.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warmBg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-slate-200"></div>
            <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-coral border-t-transparent animate-spin"></div>
          </div>
          <p className="text-slate-500 font-medium">Cargando respuestas...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-warmBg flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-rose-light flex items-center justify-center">
            <FileText className="w-10 h-10 text-rose" />
          </div>
          <p className="text-slate-600 text-lg">Formulario no encontrado</p>
        </div>
      </div>
    );
  }

  const questions = form.questions || [];

  return (
    <div className="min-h-screen bg-warmBg flex flex-col">
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/inicio/formularios">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-coral hover:bg-coral-light">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-charcoal flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-teal" />
              Respuestas
            </h1>
            <span className="text-sm text-slate-500">|</span>
            <span className="text-slate-600 font-medium">{form.name}</span>
          </div>
          {answers.length > 0 && (
            <Button 
              onClick={exportToCSV} 
              variant="outline"
              className="border-coral text-coral hover:bg-coral-light hover:border-coral"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Card className="shadow-lg border-slate-100">
          <CardHeader className="bg-gradient-to-r from-teal-light to-transparent">
            <CardTitle className="text-charcoal flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal" />
              {answers.length} {answers.length === 1 ? "respuesta" : "respuestas"}
              {answers.length > 0 && (
                <span className="ml-2 text-sm font-normal text-slate-500">
                  de {form.name}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {answers.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-sunny-light flex items-center justify-center">
                  <MessageCircle className="w-12 h-12 text-sunny-dark" />
                </div>
                <p className="text-slate-600 text-lg mb-2">No hay respuestas aún</p>
                <p className="text-slate-400">Comparte el formulario para obtener respuestas</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                      <TableHead className="font-semibold text-slate-600">Fecha</TableHead>
                      {questions.map((q, idx) => (
                        <TableHead 
                          key={q.id} 
                          className="font-semibold text-slate-600 min-w-[150px]"
                        >
                          <span className="inline-flex items-center gap-1">
                            <span className="w-5 h-5 rounded-full bg-coral-light text-coral text-xs flex items-center justify-center">
                              {idx + 1}
                            </span>
                            {q.question_text.length > 30 
                              ? q.question_text.substring(0, 30) + "..." 
                              : q.question_text}
                          </span>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {answers.map((answer, index) => (
                      <TableRow 
                        key={answer.submission_id} 
                        className="hover:bg-teal-light/20 transition-colors"
                      >
                        <TableCell className="whitespace-nowrap text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-coral"></span>
                            {new Date(answer.submitted_at).toLocaleString("es-MX")}
                          </span>
                        </TableCell>
                        {questions.map((q) => (
                          <TableCell key={q.id} className="text-charcoal">
                            {answer.answers[q.question_text] || (
                              <span className="text-slate-300 italic">Sin respuesta</span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <AppFooter />
    </div>
  );
};

export default AnswersTable;

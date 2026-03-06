import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  ClipboardList,
  Search,
  ToggleLeft,
  ToggleRight,
  ArrowLeft,
  FileText,
  Copy,
  Sparkles,
} from "lucide-react";
import { formsService } from "@/services/formsService";
import type { Form } from "@/types/forms";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import AppFooter from "@/components/AppFooter";
import type { FormListItem } from "@/types/forms";

const FormBuilderList: React.FC = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState<FormListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState<{ slug: string; name: string } | null>(null);

  const loadForms = useCallback(async () => {
    try {
      const data = await formsService.listForms();
      setForms(data);
    } catch (_error) {
      toast.error("Error al cargar formularios");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadForms();
  }, [loadForms]);

  const handleDelete = useCallback(async (slug: string) => {
    try {
      await formsService.deleteForm(slug);
      toast.success("Formulario eliminado", {
        description: "El formulario ha sido eliminado correctamente",
        duration: 4000,
      });
      loadForms();
    } catch (_error) {
      toast.error("Error al eliminar formulario");
    }
  }, [loadForms]);

  const openDeleteDialog = useCallback((slug: string, name: string) => {
    setFormToDelete({ slug, name });
    setDeleteDialogOpen(true);
  }, []);

  const handleToggleActive = useCallback(async (form: FormListItem) => {
    try {
      await formsService.toggleFormActive(form.slug, !form.is_active);
      toast.success(form.is_active ? "Formulario desactivado" : "Formulario activado");
      loadForms();
    } catch (_error) {
      toast.error("Error al cambiar estado");
    }
  }, [loadForms]);

  const handleDuplicate = useCallback(async (form: FormListItem) => {
    try {
      const newForm = await formsService.duplicateForm(form.slug);
      toast.success("Formulario duplicado");
      navigate(`/inicio/formularios/${newForm.slug}/editar`);
    } catch (_error) {
      toast.error("Error al duplicar formulario");
    }
  }, [navigate]);

  const filteredForms = forms.filter(
    (form) =>
      form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-warmBg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-slate-200"></div>
            <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-coral border-t-transparent animate-spin"></div>
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
          <div className="flex items-center gap-4">
            <Link to="/inicio">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-coral hover:bg-coral-light">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-charcoal flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-coral" />
              Gestionar Formularios
            </h1>
          </div>
          <Link to="/inicio/formularios/crear">
            <Button className="bg-gradient-to-r from-coral to-coral-dark text-white hover:opacity-90 shadow-lg shadow-coral/25">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Formulario
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Card className="shadow-lg border-slate-100">
          <CardHeader className="bg-gradient-to-r from-teal-light to-transparent">
            <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
              <CardTitle className="text-charcoal flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-teal" />
                Mis Formularios
                {forms.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-slate-500">
                    ({forms.length})
                  </span>
                )}
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Buscar formularios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 max-w-xs border-slate-200 focus:border-coral focus:ring-coral/20"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredForms.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-coral-light flex items-center justify-center">
                  <ClipboardList className="w-12 h-12 text-coral" />
                </div>
                {searchTerm ? (
                  <>
                    <p className="text-slate-600 text-lg mb-2">No se encontraron resultados</p>
                    <p className="text-slate-400 mb-6">Intenta con otros términos de búsqueda</p>
                  </>
                ) : (
                  <>
                    <p className="text-slate-600 text-lg mb-2">No hay formularios aún</p>
                    <p className="text-slate-400 mb-6">Crea tu primer formulario para comenzar</p>
                  </>
                )}
                {!searchTerm && (
                  <Link to="/inicio/formularios/crear">
                    <Button className="bg-gradient-to-r from-coral to-coral-dark text-white hover:opacity-90">
                      <Plus className="h-4 w-4 mr-2" />
                      Crear tu primer formulario
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead className="font-semibold text-slate-600">Nombre</TableHead>
                    <TableHead className="font-semibold text-slate-600">Slug</TableHead>
                    <TableHead className="font-semibold text-slate-600">Preguntas</TableHead>
                    <TableHead className="font-semibold text-slate-600">Respuestas</TableHead>
                    <TableHead className="font-semibold text-slate-600">Estado</TableHead>
                    <TableHead className="text-right font-semibold text-slate-600">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredForms.map((form, index) => (
                    <TableRow 
                      key={form.id} 
                      className="hover:bg-coral-light/30 transition-colors"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell className="font-medium text-charcoal">{form.name}</TableCell>
                      <TableCell className="text-slate-500 font-mono text-sm">{form.slug}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-teal-light text-teal-dark text-sm font-medium">
                          {form.questions_count}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-sunny-light text-sunny-dark text-sm font-medium">
                          {form.answers_count}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                            form.is_active
                              ? "bg-mint-light text-mint"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {form.is_active ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse"></span>
                              Activo
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                              Inactivo
                            </>
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-coral-light hover:text-coral">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white border-slate-200">
                            <DropdownMenuItem asChild className="focus:bg-teal-light focus:text-teal-dark">
                              <Link to={`/formularios/${form.slug}`} target="_blank">
                                <Eye className="h-4 w-4 mr-2" />
                                Ver público
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicate(form)} className="focus:bg-coral-light focus:text-coral">
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="focus:bg-teal-light focus:text-teal-dark">
                              <Link to={`/inicio/formularios/${form.slug}/editar`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="focus:bg-sunny-light focus:text-sunny-dark">
                              <Link to={`/inicio/formularios/${form.slug}/respuestas`}>
                                <FileText className="h-4 w-4 mr-2" />
                                Respuestas
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleActive(form)} className="focus:bg-mint-light focus:text-mint">
                              {form.is_active ? (
                                <>
                                  <ToggleLeft className="h-4 w-4 mr-2" />
                                  Desactivar
                                </>
                              ) : (
                                <>
                                  <ToggleRight className="h-4 w-4 mr-2" />
                                  Activar
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openDeleteDialog(form.slug, form.name)}
                              className="text-rose focus:bg-rose-light focus:text-rose"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="border-rose-light">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-charcoal flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-rose" />
              ¿Estás seguro de eliminar este formulario?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">
              Esta acción no se puede deshacer. El formulario "{formToDelete?.name}" será eliminado permanentemente,
              incluyendo todas sus preguntas y respuestas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-200 hover:bg-slate-50">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (formToDelete) {
                  handleDelete(formToDelete.slug);
                }
              }}
              className="bg-rose hover:bg-rose/90 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AppFooter />
    </div>
  );
};

export default FormBuilderList;

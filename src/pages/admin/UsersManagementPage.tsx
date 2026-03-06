import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import { motion } from "framer-motion";
import {
  Users,
  ArrowLeft,
  Search,
  Plus,
  Pencil,
  Trash2,
  MoreHorizontal,
  Shield,
  ShieldAlert,
  UserCheck,
  UserX,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import AppFooter from "@/components/AppFooter";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usersAdminService } from "@/services/usersAdminService";
import type {
  UserListItem,
  CreateUserData,
  UpdateUserData,
  UserRole,
} from "@/services/usersAdminService";

const ROLE_LABELS: Record<UserRole, string> = {
  administrator: "Administrador",
  volunteer: "Voluntario",
};

const UsersManagementPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    pageSize: 10,
  });

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createForm, setCreateForm] = useState<CreateUserData>({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    role: "volunteer",
    is_staff: false,
  });

  const [editForm, setEditForm] = useState<UpdateUserData>({});

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string | number | boolean> = {
        page: pagination.currentPage,
        page_size: pagination.pageSize,
      };

      if (search) params.search = search;
      if (roleFilter !== "all") params.role = roleFilter;
      if (statusFilter === "active") params.is_active = true;
      if (statusFilter === "inactive") params.is_active = false;

      const response = await usersAdminService.getUsers(params);
      setUsers(response.results);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.total_pages,
        total: response.count,
      }));
    } catch (error) {
      toast.error("Error al cargar usuarios");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.currentPage, pagination.pageSize, search, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, [search, roleFilter, statusFilter]);

  const handleCreateUser = async () => {
    setIsSubmitting(true);
    try {
      await usersAdminService.createUser(createForm);
      toast.success("Usuario creado exitosamente");
      setIsCreateDialogOpen(false);
      setCreateForm({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        role: "volunteer",
        is_staff: false,
      });
      fetchUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al crear usuario");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      await usersAdminService.updateUser(selectedUser.id, editForm);
      toast.success("Usuario actualizado exitosamente");
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      setEditForm({});
      fetchUsers();
    } catch (error) {
      toast.error("Error al actualizar usuario");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      await usersAdminService.deleteUser(selectedUser.id);
      toast.success("Usuario desactivado exitosamente");
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      toast.error("Error al desactivar usuario");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (user: UserListItem) => {
    try {
      await usersAdminService.toggleUserActive(user.id, !user.is_active);
      toast.success(user.is_active ? "Usuario desactivado" : "Usuario activado");
      fetchUsers();
    } catch (error) {
      toast.error("Error al cambiar estado del usuario");
    }
  };

  const openEditDialog = (user: UserListItem) => {
    setSelectedUser(user);
    setEditForm({
      first_name: user.first_name,
      last_name: user.last_name,
      is_active: user.is_active,
      is_staff: user.is_staff,
      role: user.role,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: UserListItem) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-blancoHuesoFondo flex flex-col">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/inicio")}
              className="text-blackOlive hover:text-moradoSecundario"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/images/landing/navbar2.png"
                alt="Tijuanita Mi Ciudad"
                className="h-10 w-auto"
              />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-blackOlive text-sm">
              {user?.first_name} {user?.last_name}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blackOlive font-kawaiiRT flex items-center gap-3">
                <Users className="w-8 h-8" />
                Gestión de Usuarios
              </h1>
              <p className="text-blackOlive/70 mt-1">
                Administra los usuarios de la plataforma
              </p>
            </div>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-gradient-to-r from-moradoSecundario to-[#0a33ff] text-white hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Usuario
            </Button>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border-4 border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar usuarios..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 border-2 border-gray-200 rounded-xl"
                />
              </div>
              <Select
                value={roleFilter}
                onValueChange={(value) => setRoleFilter(value as UserRole | "all")}
              >
                <SelectTrigger className="w-[180px] border-2 border-gray-200 rounded-xl">
                  <SelectValue placeholder="Filtrar por rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  <SelectItem value="administrator">Administrador</SelectItem>
                  <SelectItem value="volunteer">Voluntario</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as "all" | "active" | "inactive")}
              >
                <SelectTrigger className="w-[180px] border-2 border-gray-200 rounded-xl">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Usuario</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Rol</TableHead>
                    <TableHead className="font-semibold">Estado</TableHead>
                    <TableHead className="font-semibold">Staff</TableHead>
                    <TableHead className="font-semibold">Fecha de registro</TableHead>
                    <TableHead className="text-right font-semibold">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-moradoSecundario" />
                        <p className="text-gray-500 mt-2">Cargando usuarios...</p>
                      </TableCell>
                    </TableRow>
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <Users className="w-12 h-12 mx-auto text-gray-300" />
                        <p className="text-gray-500 mt-2">No se encontraron usuarios</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((userItem) => (
                      <TableRow key={userItem.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-moradoSecundario/10 flex items-center justify-center">
                              <span className="text-moradoSecundario font-semibold">
                                {userItem.first_name?.[0] || userItem.username?.[0] || "?"}
                                {userItem.last_name?.[0] || ""}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">
                                {userItem.first_name} {userItem.last_name}
                              </p>
                              <p className="text-sm text-gray-500">@{userItem.username}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{userItem.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant={userItem.role === "administrator" ? "default" : "secondary"}
                            className={
                              userItem.role === "administrator"
                                ? "bg-purple-100 text-purple-700 hover:bg-purple-100"
                                : "bg-blue-100 text-blue-700 hover:bg-blue-100"
                            }
                          >
                            {userItem.role === "administrator" ? (
                              <ShieldAlert className="w-3 h-3 mr-1" />
                            ) : (
                              <Shield className="w-3 h-3 mr-1" />
                            )}
                            {ROLE_LABELS[userItem.role]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={userItem.is_active ? "default" : "destructive"}
                            className={
                              userItem.is_active
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : "bg-red-100 text-red-700 hover:bg-red-100"
                            }
                          >
                            {userItem.is_active ? (
                              <UserCheck className="w-3 h-3 mr-1" />
                            ) : (
                              <UserX className="w-3 h-3 mr-1" />
                            )}
                            {userItem.is_active ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {userItem.is_staff ? (
                            <span className="text-sm text-gray-600">Sí</span>
                          ) : (
                            <span className="text-sm text-gray-400">No</span>
                          )}
                        </TableCell>
                        <TableCell>{formatDate(userItem.date_joined)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(userItem)}>
                                <Pencil className="w-4 h-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleActive(userItem)}>
                                {userItem.is_active ? (
                                  <>
                                    <UserX className="w-4 h-4 mr-2" />
                                    Desactivar
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="w-4 h-4 mr-2" />
                                    Activar
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => openDeleteDialog(userItem)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {pagination.totalPages > 1 && (
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Mostrando {((pagination.currentPage - 1) * pagination.pageSize) + 1} -{" "}
                    {Math.min(pagination.currentPage * pagination.pageSize, pagination.total)} de{" "}
                    {pagination.total} usuarios
                  </p>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setPagination((prev) => ({
                              ...prev,
                              currentPage: Math.max(1, prev.currentPage - 1),
                            }))
                          }
                          className={
                            pagination.currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                        .filter(
                          (page) =>
                            page === 1 ||
                            page === pagination.totalPages ||
                            Math.abs(page - pagination.currentPage) <= 1
                        )
                        .map((page, index, array) => (
                          <React.Fragment key={page}>
                            {index > 0 && array[index - 1] !== page - 1 && (
                              <PaginationItem>
                                <span className="text-gray-400">...</span>
                              </PaginationItem>
                            )}
                            <PaginationItem>
                              <PaginationLink
                                onClick={() =>
                                  setPagination((prev) => ({ ...prev, currentPage: page }))
                                }
                                isActive={pagination.currentPage === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          </React.Fragment>
                        ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setPagination((prev) => ({
                              ...prev,
                              currentPage: Math.min(prev.totalPages, prev.currentPage + 1),
                            }))
                          }
                          className={
                            pagination.currentPage === pagination.totalPages
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </main>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Usuario</DialogTitle>
            <DialogDescription>
              Completa los datos para crear un nuevo usuario en la plataforma.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Nombre</Label>
                <Input
                  id="first_name"
                  value={createForm.first_name}
                  onChange={(e) =>
                    setCreateForm((prev) => ({ ...prev, first_name: e.target.value }))
                  }
                  placeholder="Juan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Apellido</Label>
                <Input
                  id="last_name"
                  value={createForm.last_name}
                  onChange={(e) =>
                    setCreateForm((prev) => ({ ...prev, last_name: e.target.value }))
                  }
                  placeholder="Pérez"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={createForm.email}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="juan@ejemplo.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={createForm.password}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, password: e.target.value }))
                }
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Select
                value={createForm.role}
                onValueChange={(value) =>
                  setCreateForm((prev) => ({ ...prev, role: value as UserRole }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="volunteer">Voluntario</SelectItem>
                  <SelectItem value="administrator">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_staff"
                checked={createForm.is_staff}
                onCheckedChange={(checked) =>
                  setCreateForm((prev) => ({ ...prev, is_staff: checked as boolean }))
                }
              />
              <Label htmlFor="is_staff" className="text-sm font-normal">
                Acceso al panel de administración (Django Admin)
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreateUser}
              disabled={isSubmitting || !createForm.email || !createForm.password || !createForm.first_name}
              className="bg-gradient-to-r from-moradoSecundario to-[#0a33ff] text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear Usuario"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>
              Actualiza la información del usuario.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_first_name">Nombre</Label>
                <Input
                  id="edit_first_name"
                  value={editForm.first_name || ""}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, first_name: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_last_name">Apellido</Label>
                <Input
                  id="edit_last_name"
                  value={editForm.last_name || ""}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, last_name: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_role">Rol</Label>
              <Select
                value={editForm.role || "volunteer"}
                onValueChange={(value) =>
                  setEditForm((prev) => ({ ...prev, role: value as UserRole }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="volunteer">Voluntario</SelectItem>
                  <SelectItem value="administrator">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit_is_active"
                checked={editForm.is_active ?? true}
                onCheckedChange={(checked) =>
                  setEditForm((prev) => ({ ...prev, is_active: checked as boolean }))
                }
              />
              <Label htmlFor="edit_is_active" className="text-sm font-normal">
                Usuario activo
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit_is_staff"
                checked={editForm.is_staff ?? false}
                onCheckedChange={(checked) =>
                  setEditForm((prev) => ({ ...prev, is_staff: checked as boolean }))
                }
              />
              <Label htmlFor="edit_is_staff" className="text-sm font-normal">
                Acceso al panel de administración (Django Admin)
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleEditUser}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-moradoSecundario to-[#0a33ff] text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Desactivar Usuario</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas desactivar a{" "}
              <span className="font-semibold">
                {selectedUser?.first_name} {selectedUser?.last_name}
              </span>
              ? El usuario no podrá acceder a la plataforma.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteUser}
              disabled={isSubmitting}
              variant="destructive"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Desactivando...
                </>
              ) : (
                "Desactivar Usuario"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AppFooter />
    </div>
  );
};

export default UsersManagementPage;

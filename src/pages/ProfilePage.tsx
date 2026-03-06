import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { userService } from "../services/userService";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, LogOut, Camera, Upload, X, User } from "lucide-react";
import AppFooter from "../components/AppFooter";

const ProfilePage: React.FC = () => {
  const { user, fetchUser, logoutUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    bio: user?.profile?.bio || "",
    organization: user?.profile?.organization || "",
    position: user?.profile?.position || "",
    date_of_birth: user?.profile?.date_of_birth || "",
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    user?.profile?.photo || null
  );

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        bio: user.profile?.bio || "",
        organization: user.profile?.organization || "",
        position: user.profile?.position || "",
        date_of_birth: user.profile?.date_of_birth || "",
      });
      setPhotoPreview(user.profile?.photo || null);
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Formato de imagen no válido. Usa JPEG, PNG, WebP o GIF.");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("La imagen no puede superar 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    setUploadingPhoto(true);
    try {
      await userService.uploadProfilePhoto(file);
      toast.success("Foto de perfil actualizada");
      await fetchUser();
    } catch (error) {
      toast.error("Error al subir la foto");
      setPhotoPreview(user?.profile?.photo || null);
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemovePhoto = async () => {
    setUploadingPhoto(true);
    try {
      await userService.removeProfilePhoto();
      setPhotoPreview(null);
      toast.success("Foto de perfil eliminada");
      await fetchUser();
    } catch (error) {
      toast.error("Error al eliminar la foto");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await userService.updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        profile: {
          bio: formData.bio,
          organization: formData.organization,
          position: formData.position,
          date_of_birth: formData.date_of_birth || undefined,
        },
      });
      toast.success("Perfil actualizado correctamente");
      await fetchUser();
    } catch (error) {
      toast.error("Error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  const getInitials = () => {
    const first = formData.first_name?.[0] || "";
    const last = formData.last_name?.[0] || "";
    return (first + last).toUpperCase() || "U";
  };

  return (
    <div className="min-h-screen bg-blancoHuesoFondo flex flex-col">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/inicio"
              className="flex items-center gap-2 text-blackOlive hover:text-moradoSecundario transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Volver</span>
            </Link>
          </div>
          <h1 className="text-xl font-bold text-blackOlive">Tijuanita Mi Ciudad</h1>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-blackOlive hover:text-red-600"
          >
            <LogOut className="h-5 w-5 sm:mr-2" />
            <span className="hidden sm:inline">Salir</span>
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-4 border-white/20 bg-white/10 backdrop-blur-lg shadow-2xl rounded-3xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-blackOlive font-kawaiiRT">
                Editar Perfil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative group">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Foto de perfil"
                        className="w-24 h-24 rounded-full object-cover border-4 border-moradoSecundario/30"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-moradoSecundario/20 flex items-center justify-center text-3xl font-bold text-moradoSecundario">
                        {getInitials()}
                      </div>
                    )}
                    <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                    <button
                      type="button"
                      onClick={handlePhotoClick}
                      disabled={uploadingPhoto}
                      className="absolute inset-0 rounded-full cursor-pointer disabled:cursor-not-allowed"
                    />
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handlePhotoClick}
                      disabled={uploadingPhoto}
                      className="border-gray-300 text-blackOlive"
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      {uploadingPhoto ? "Subiendo..." : "Cambiar"}
                    </Button>
                    {photoPreview && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRemovePhoto}
                        disabled={uploadingPhoto}
                        className="border-gray-300 text-red-500 hover:bg-red-50"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Eliminar
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="first_name"
                      className="block text-sm font-medium text-blackOlive mb-1"
                    >
                      Nombre
                    </label>
                    <Input
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      placeholder="Nombre"
                      className="bg-white/50 border-gray-200 text-blackOlive"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="last_name"
                      className="block text-sm font-medium text-blackOlive mb-1"
                    >
                      Apellido
                    </label>
                    <Input
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      placeholder="Apellido"
                      className="bg-white/50 border-gray-200 text-blackOlive"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-blackOlive mb-1"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-gray-100 border-gray-200 text-blackOlive/50"
                  />
                  <p className="text-xs text-blackOlive/50 mt-1">El email no se puede cambiar</p>
                </div>

                <div>
                  <label
                    htmlFor="organization"
                    className="block text-sm font-medium text-blackOlive mb-1"
                  >
                    Organización
                  </label>
                  <Input
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                    placeholder="Tu organización"
                    className="bg-white/50 border-gray-200 text-blackOlive"
                  />
                </div>

                <div>
                  <label
                    htmlFor="position"
                    className="block text-sm font-medium text-blackOlive mb-1"
                  >
                    Cargo
                  </label>
                  <Input
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder="Tu cargo en la organización"
                    className="bg-white/50 border-gray-200 text-blackOlive"
                  />
                </div>

                <div>
                  <label
                    htmlFor="date_of_birth"
                    className="block text-sm font-medium text-blackOlive mb-1"
                  >
                    Fecha de Nacimiento
                  </label>
                  <Input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    className="bg-white/50 border-gray-200 text-blackOlive"
                  />
                </div>

                <div>
                  <label
                    htmlFor="bio"
                    className="block text-sm font-medium text-blackOlive mb-1"
                  >
                    Biografía
                  </label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Cuéntanos sobre ti..."
                    rows={4}
                    className="bg-white/50 border-gray-200 text-blackOlive resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/inicio")}
                    className="border-gray-300 text-blackOlive hover:bg-gray-100"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-moradoSecundario to-[#0a33ff] text-white hover:opacity-90"
                  >
                    {loading ? "Guardando..." : "Guardar Cambios"}
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

export default ProfilePage;

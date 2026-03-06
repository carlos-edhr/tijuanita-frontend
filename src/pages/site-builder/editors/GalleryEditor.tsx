import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Card } from "../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { cmsService, type CMSGalleryImage } from "../../../services/cmsService";
import { toast } from "sonner";
import { Save, Upload, Loader2, Plus, Trash2, Edit, Image as ImageIcon } from "lucide-react";

interface GalleryContent {
  id?: number;
  title: { es: string; en: string };
}

interface GalleryEditorProps {
  content: GalleryContent;
  onChange: (content: GalleryContent) => void;
  onSave: () => void;
  isSaving: boolean;
  galleryImages?: CMSGalleryImage[];
  onAddGalleryImage?: (image: Partial<CMSGalleryImage>) => Promise<void>;
  onUpdateGalleryImage?: (id: number, image: Partial<CMSGalleryImage>) => Promise<void>;
  onDeleteGalleryImage?: (id: number) => Promise<void>;
  onReorderGalleryImages?: (images: CMSGalleryImage[]) => Promise<void>;
}

const defaultGalleryContent: GalleryContent = {
  title: { es: 'Galería', en: 'Gallery' },
};

const GalleryEditor: React.FC<GalleryEditorProps> = ({ 
  content, 
  onChange, 
  onSave, 
  isSaving,
  galleryImages = [],
  onAddGalleryImage,
  onUpdateGalleryImage,
  onDeleteGalleryImage,
  onReorderGalleryImages
}) => {
  const [activeLang, setActiveLang] = useState<'es' | 'en'>('es');
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'images'>('content');
  const [editingImage, setEditingImage] = useState<CMSGalleryImage | null>(null);
  const [newImage, setNewImage] = useState<Partial<CMSGalleryImage>>({
    image: null,
    title: { es: '', en: '' },
    description: { es: '', en: '' },
    alt_text: { es: '', en: '' },
    order: galleryImages.length,
    is_active: true,
    section: 1, // Assuming there's only one gallery section
  });
  
  const data = { ...defaultGalleryContent, ...content };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const result = await cmsService.uploadImage(file);
      setNewImage({ ...newImage, image: result.url });
      toast.success('Imagen subida correctamente');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        handleImageUpload(target.files[0]);
      }
    };
    input.click();
  };

  const updateLocalizedField = (field: keyof GalleryContent, lang: 'es' | 'en', value: string) => {
    const current = data[field];
    if (current && typeof current === 'object') {
      onChange({ ...data, [field]: { ...(current as Record<string, string>), [lang]: value } });
    }
  };
  
  const getLocalizedValue = (field: keyof GalleryContent): string => {
    const value = data[field];
    return value && typeof value === 'object' ? (value as Record<string, string>)[activeLang] || '' : '';
  };

  const handleAddImage = async () => {
    if (!onAddGalleryImage) return;
    await onAddGalleryImage(newImage);
    setNewImage({
      image: null,
      title: { es: '', en: '' },
      description: { es: '', en: '' },
      alt_text: { es: '', en: '' },
      order: galleryImages.length + 1,
      is_active: true,
      section: 1,
    });
  };

  const handleUpdateImage = async () => {
    if (!editingImage || !onUpdateGalleryImage || !editingImage.id) return;
    await onUpdateGalleryImage(editingImage.id, editingImage);
    setEditingImage(null);
  };

  const handleDeleteImage = async (id: number) => {
    if (!onDeleteGalleryImage) return;
    if (window.confirm('¿Estás seguro de eliminar esta imagen?')) {
      await onDeleteGalleryImage(id);
    }
  };

  const ContentEditor = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-3">
        <Label className="text-base font-semibold">Sección Galería</Label>
        <div className="flex gap-2">
          <Button variant={activeLang === 'es' ? 'default' : 'outline'} size="sm" onClick={() => setActiveLang('es')} className={activeLang === 'es' ? 'bg-green-600' : ''}>Español</Button>
          <Button variant={activeLang === 'en' ? 'default' : 'outline'} size="sm" onClick={() => setActiveLang('en')} className={activeLang === 'en' ? 'bg-green-600' : ''}>English</Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Título</Label>
        <Input 
          value={getLocalizedValue('title')} 
          onChange={(e) => updateLocalizedField('title', activeLang, e.target.value)} 
          placeholder="Título de la galería"
        />
      </div>
    </div>
  );

  const ImagesEditor = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-3">
        <Label className="text-base font-semibold">Imágenes de la Galería</Label>
        <Button size="sm" onClick={() => setActiveTab('content')}>Volver a Contenido</Button>
      </div>
      
      {/* Add new image form */}
      <Card className="p-4">
        <h4 className="font-semibold mb-4">Agregar Nueva Imagen</h4>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Imagen</Label>
            <div className="flex gap-2">
              <Input 
                value={newImage.image || ''} 
                onChange={(e) => setNewImage({...newImage, image: e.target.value})} 
                placeholder="URL de la imagen"
              />
              <Button variant="outline" size="sm" onClick={handleUploadClick} disabled={uploading}>
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Título (ES)</Label>
              <Input 
                value={newImage.title?.es || ''} 
                onChange={(e) => setNewImage({...newImage, title: { ...newImage.title, es: e.target.value }})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Título (EN)</Label>
              <Input 
                value={newImage.title?.en || ''} 
                onChange={(e) => setNewImage({...newImage, title: { ...newImage.title, en: e.target.value }})} 
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Descripción (ES)</Label>
              <Textarea 
                value={newImage.description?.es || ''} 
                onChange={(e) => setNewImage({...newImage, description: { ...newImage.description, es: e.target.value }})} 
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Descripción (EN)</Label>
              <Textarea 
                value={newImage.description?.en || ''} 
                onChange={(e) => setNewImage({...newImage, description: { ...newImage.description, en: e.target.value }})} 
                rows={3}
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Texto Alternativo (ES)</Label>
              <Input 
                value={newImage.alt_text?.es || ''} 
                onChange={(e) => setNewImage({...newImage, alt_text: { ...newImage.alt_text, es: e.target.value }})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Texto Alternativo (EN)</Label>
              <Input 
                value={newImage.alt_text?.en || ''} 
                onChange={(e) => setNewImage({...newImage, alt_text: { ...newImage.alt_text, en: e.target.value }})} 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={newImage.is_active ?? true}
              onChange={(e) => setNewImage({...newImage, is_active: e.target.checked})}
              className="rounded"
            />
            <Label htmlFor="is_active" className="cursor-pointer">Activa (visible en la galería)</Label>
          </div>
          
          <Button onClick={handleAddImage} disabled={!onAddGalleryImage}>
            <Plus className="w-4 h-4 mr-2" /> Agregar Imagen
          </Button>
        </div>
      </Card>

      {/* List of existing images */}
      <div className="space-y-4">
        <h4 className="font-semibold">Imágenes Existentes ({galleryImages.length})</h4>
        {galleryImages.length === 0 ? (
          <p className="text-gray-500 italic">No hay imágenes agregadas aún.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryImages.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <div className="relative aspect-video bg-gray-100">
                  {image.image ? (
                    <img 
                      src={image.image} 
                      alt={image.alt_text?.es || ''}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h5 className="font-semibold line-clamp-1">{image.title?.es || 'Sin título'}</h5>
                  <p className="text-sm text-gray-600 line-clamp-2">{image.description?.es || ''}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${image.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {image.is_active ? 'Activa' : 'Inactiva'}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingImage(image)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteImage(image.id!)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'content' | 'images')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">Contenido</TabsTrigger>
          <TabsTrigger value="images">Imágenes</TabsTrigger>
        </TabsList>
        <TabsContent value="content">
          <ContentEditor />
        </TabsContent>
        <TabsContent value="images">
          <ImagesEditor />
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button onClick={onSave} disabled={isSaving} className="bg-green-600 hover:bg-green-700">
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </div>
  );
};

export default GalleryEditor;
export type { GalleryContent, GalleryEditorProps };

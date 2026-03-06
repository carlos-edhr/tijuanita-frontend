import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card } from "../../../components/ui/card";
import { cmsService } from "../../../services/cmsService";
import { toast } from "sonner";
import { Save, Upload, Loader2 } from "lucide-react";

interface NavbarContent {
  id?: number;
  logo: string | null;
  logo_text: { es: string; en: string };
  cta_text: { es: string; en: string };
  cta_link: { es: string; en: string };
}

interface NavbarEditorProps {
  content: NavbarContent;
  onChange: (content: NavbarContent) => void;
  onSave: () => void;
  isSaving: boolean;
}

const defaultNavbarContent: NavbarContent = {
  logo: '/images/landing/navbar2.png',
  logo_text: { es: 'Tijuanita Mi Ciudad', en: 'Tijuanita Mi Ciudad' },
  cta_text: { es: 'Iniciar Sesión', en: 'Login' },
  cta_link: { es: '/login', en: '/login' },
};

const NavbarEditor: React.FC<NavbarEditorProps> = ({ content, onChange, onSave, isSaving }) => {
  const [activeLang, setActiveLang] = useState<'es' | 'en'>('es');
  const [uploading, setUploading] = useState(false);
  const data = { ...defaultNavbarContent, ...content };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const result = await cmsService.uploadImage(file);
      onChange({ ...data, logo: result.url });
      toast.success('Logo subido correctamente');
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

  const updateField = (field: string, value: unknown) => onChange({ ...data, [field]: value });
  const updateLocalizedField = (field: string, lang: 'es' | 'en', value: string) => {
    const current = data[field as keyof NavbarContent];
    if (current && typeof current === 'object') onChange({ ...data, [field]: { ...(current as object), [lang]: value } });
  };
  const getLocalizedValue = (field: string): string => {
    const value = data[field as keyof NavbarContent];
    return value && typeof value === 'object' ? (value as Record<string, string>)[activeLang] || '' : '';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-3">
        <Label className="text-base font-semibold">Barra de Navegación</Label>
        <div className="flex gap-2">
          <Button variant={activeLang === 'es' ? 'default' : 'outline'} size="sm" onClick={() => setActiveLang('es')} className={activeLang === 'es' ? 'bg-green-600' : ''}>Español</Button>
          <Button variant={activeLang === 'en' ? 'default' : 'outline'} size="sm" onClick={() => setActiveLang('en')} className={activeLang === 'en' ? 'bg-green-600' : ''}>English</Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label>URL del Logo</Label>
        <div className="flex gap-2 items-center">
          <Input value={data.logo || ''} onChange={(e) => updateField('logo', e.target.value)} placeholder="/images/logo.png" className="flex-1" />
          <Button variant="outline" size="sm" onClick={handleUploadClick} disabled={uploading}>
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Texto del Logo</Label>
        <Input value={getLocalizedValue('logo_text')} onChange={(e) => updateLocalizedField('logo_text', activeLang, e.target.value)} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Texto del Botón CTA</Label>
          <Input value={getLocalizedValue('cta_text')} onChange={(e) => updateLocalizedField('cta_text', activeLang, e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>URL del Botón CTA</Label>
          <Input value={getLocalizedValue('cta_link')} onChange={(e) => updateLocalizedField('cta_link', activeLang, e.target.value)} />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button onClick={onSave} disabled={isSaving} className="bg-green-600 hover:bg-green-700"><Save className="w-4 h-4 mr-2" />{isSaving ? 'Guardando...' : 'Guardar'}</Button>
      </div>
    </div>
  );
};

export default NavbarEditor;
export type { NavbarContent, NavbarEditorProps };

import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Card } from "../../../components/ui/card";
import { cmsService } from "../../../services/cmsService";
import { toast } from "sonner";
import { Save, Upload, Loader2 } from "lucide-react";

interface QueEsContent {
  id?: number;
  title: { es: string; en: string };
  card1_title: { es: string; en: string };
  card1_description: { es: string; en: string };
  card1_button_text: { es: string; en: string };
  card1_image: string | null;
  card1_color: string;
  card2_title: { es: string; en: string };
  card2_description: { es: string; en: string };
  card2_button_text: { es: string; en: string };
  card2_image: string | null;
  card2_color: string;
  card3_title: { es: string; en: string };
  card3_description: { es: string; en: string };
  card3_button_text: { es: string; en: string };
  card3_image: string | null;
  card3_color: string;
}

interface QueEsEditorProps {
  content: QueEsContent;
  onChange: (content: QueEsContent) => void;
  onSave: () => void;
  isSaving: boolean;
}

const defaultQueEsContent: QueEsContent = {
  title: { es: '¿Qué es Vía Recreativa?', en: 'What is Vía Recreativa?' },
  card1_title: { es: 'Comunidad activa', en: 'Active Community' },
  card1_description: { es: 'Vía recreativa', en: 'Recreational path' },
  card1_button_text: { es: 'Derecho a la movilidad segura', en: 'Right to safe mobility' },
  card1_image: '/images/landing/quees1.png',
  card1_color: '#FF6B6B',
  card2_title: { es: 'Espacios creativos', en: 'Creative Spaces' },
  card2_description: { es: 'convocatoria', en: 'Call' },
  card2_button_text: { es: 'Derecho al juego y participación', en: 'Right to play and participation' },
  card2_image: '/images/landing/quees2.png',
  card2_color: '#4ECDC4',
  card3_title: { es: 'Contexto', en: 'Context' },
  card3_description: { es: 'participa', en: 'Participate' },
  card3_button_text: { es: 'Contexto', en: 'Context' },
  card3_image: '/images/landing/quees3.png',
  card3_color: '#FFCC5C',
};

const QueEsEditor: React.FC<QueEsEditorProps> = ({ content, onChange, onSave, isSaving }) => {
  const [activeLang, setActiveLang] = useState<'es' | 'en'>('es');
  const [uploading, setUploading] = useState<string | null>(null);
  const data = { ...defaultQueEsContent, ...content };

  const handleImageUpload = async (field: string, file: File) => {
    try {
      setUploading(field);
      const result = await cmsService.uploadImage(file);
      onChange({ ...data, [field]: result.url });
      toast.success('Imagen subida correctamente');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Error al subir la imagen');
    } finally {
      setUploading(null);
    }
  };

  const handleUploadClick = (field: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        handleImageUpload(field, target.files[0]);
      }
    };
    input.click();
  };

  const updateField = (field: string, value: unknown) => onChange({ ...data, [field]: value });
  const updateLocalizedField = (field: string, lang: 'es' | 'en', value: string) => {
    const current = data[field as keyof QueEsContent];
    if (current && typeof current === 'object') onChange({ ...data, [field]: { ...(current as object), [lang]: value } });
  };
  const getLocalizedValue = (field: string): string => {
    const value = data[field as keyof QueEsContent];
    return value && typeof value === 'object' ? (value as Record<string, string>)[activeLang] || '' : '';
  };

  const ColorInput = ({ field }: { field: string }) => (
    <div className="flex gap-2">
      <input type="color" value={data[field as keyof QueEsContent] as string || '#000000'} onChange={(e) => updateField(field, e.target.value)} className="w-12 h-10 rounded border" />
      <Input value={data[field as keyof QueEsContent] as string || ''} onChange={(e) => updateField(field, e.target.value)} />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-3">
        <Label className="text-base font-semibold">Sección ¿Qué es?</Label>
        <div className="flex gap-2">
          <Button variant={activeLang === 'es' ? 'default' : 'outline'} size="sm" onClick={() => setActiveLang('es')} className={activeLang === 'es' ? 'bg-green-600' : ''}>Español</Button>
          <Button variant={activeLang === 'en' ? 'default' : 'outline'} size="sm" onClick={() => setActiveLang('en')} className={activeLang === 'en' ? 'bg-green-600' : ''}>English</Button>
        </div>
      </div>
      <div className="space-y-2"><Label>Título</Label><Input value={getLocalizedValue('title')} onChange={(e) => updateLocalizedField('title', activeLang, e.target.value)} /></div>
      {['1','2','3'].map((n) => (
        <Card key={n} className="p-4 bg-gray-50">
          <h4 className="font-semibold mb-3">Tarjeta {n}</h4>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Título</Label><Input value={getLocalizedValue(`card${n}_title`)} onChange={(e) => updateLocalizedField(`card${n}_title`, activeLang, e.target.value)} /></div>
            <div className="space-y-2"><Label>Color</Label><ColorInput field={`card${n}_color`} /></div>
            <div className="space-y-2 md:col-span-2"><Label>Descripción</Label><Textarea value={getLocalizedValue(`card${n}_description`)} onChange={(e) => updateLocalizedField(`card${n}_description`, activeLang, e.target.value)} rows={2} /></div>
            <div className="space-y-2"><Label>Texto del Botón</Label><Input value={getLocalizedValue(`card${n}_button_text`)} onChange={(e) => updateLocalizedField(`card${n}_button_text`, activeLang, e.target.value)} /></div>
            <div className="space-y-2"><Label>Imagen</Label><div className="flex gap-2"><Input value={data[`card${n}_image` as keyof QueEsContent] as string || ''} onChange={(e) => updateField(`card${n}_image`, e.target.value)} /><Button variant="outline" size="sm" onClick={() => handleUploadClick(`card${n}_image`)} disabled={uploading === `card${n}_image`}>{uploading === `card${n}_image` ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}</Button></div></div>
          </div>
        </Card>
      ))}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button onClick={onSave} disabled={isSaving} className="bg-green-600 hover:bg-green-700"><Save className="w-4 h-4 mr-2" />{isSaving ? 'Guardando...' : 'Guardar'}</Button>
      </div>
    </div>
  );
};

export default QueEsEditor;
export type { QueEsContent, QueEsEditorProps };

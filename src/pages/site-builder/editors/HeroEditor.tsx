import React, { useState, useRef } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Badge } from "../../../components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../components/ui/accordion";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../components/ui/tooltip";
import FieldTooltip from "../components/FieldTooltip";
import { cmsService } from "../../../services/cmsService";
import { toast } from "sonner";
import { 
  Layout, 
  Video, 
  AlignCenter, 
  Columns, 
  Minimize2,
  Save,
  Upload,
  Check,
  X,
  Info,
  Loader2
} from "lucide-react";

interface HeroContent {
  id?: number;
  variant: 'cards' | 'video' | 'centered' | 'split' | 'minimal';
  title: { es: string; en: string };
  // Card 1
  card1_title: { es: string; en: string };
  card1_description: { es: string; en: string };
  card1_button_text: { es: string; en: string };
  card1_image: string | null;
  card1_video: string | null;
  card1_color: string;
  card1_url: { es: string; en: string };
  // Card 2
  card2_title: { es: string; en: string };
  card2_description: { es: string; en: string };
  card2_button_text: { es: string; en: string };
  card2_image: string | null;
  card2_color: string;
  card2_url: { es: string; en: string };
  // Card 3
  card3_title: { es: string; en: string };
  card3_description: { es: string; en: string };
  card3_button_text: { es: string; en: string };
  card3_image: string | null;
  card3_color: string;
  card3_url: { es: string; en: string };
  // Variant-specific fields
  video_background: string | null;
  video_overlay_text: { es: string; en: string };
  centered_cta_text: { es: string; en: string };
  centered_cta_url: { es: string; en: string };
  split_image: string | null;
  split_image_position: 'left' | 'right';
}

interface HeroEditorProps {
  content: HeroContent;
  onChange: (content: HeroContent) => void;
  onSave: () => void;
  isSaving: boolean;
}

const VARIANTS = [
  { 
    id: 'cards', 
    label: '3 Tarjetas', 
    icon: Layout, 
    description: 'Tres tarjetas con imágenes o video' 
  },
  { 
    id: 'video', 
    label: 'Video Fondo', 
    icon: Video, 
    description: 'Video de fondo con texto superpuesto' 
  },
  { 
    id: 'centered', 
    label: 'Centrado', 
    icon: AlignCenter, 
    description: 'Título centrado con CTA' 
  },
  { 
    id: 'split', 
    label: 'Dividido', 
    icon: Columns, 
    description: 'Texto a un lado, imagen al otro' 
  },
  { 
    id: 'minimal', 
    label: 'Minimalista', 
    icon: Minimize2, 
    description: 'Diseño limpio y minimalista' 
  },
] as const;

const HeroEditor: React.FC<HeroEditorProps> = ({ content, onChange, onSave, isSaving }) => {
  const [activeLang, setActiveLang] = useState<'es' | 'en'>('es');
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (field: string, file: File) => {
    try {
      setUploadingField(field);
      const result = await cmsService.uploadImage(file);
      onChange({ ...content, [field]: result.url });
      toast.success('Imagen subida correctamente');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Error al subir la imagen');
    } finally {
      setUploadingField(null);
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

  const updateLocalizedField = (field: string, lang: 'es' | 'en', value: string) => {
    const current = content[field as keyof HeroContent];
    
    // Handle case where current value is a string (convert to object first)
    let localizedObj: { es: string; en: string };
    if (typeof current === 'string') {
      localizedObj = { es: current, en: '' };
    } else if (current && typeof current === 'object') {
      localizedObj = { ...(current as object), [lang]: value } as { es: string; en: string };
    } else {
      localizedObj = { es: '', en: '' };
    }
    
    // Set the value for the current language
    localizedObj[lang] = value;
    
    onChange({
      ...content,
      [field]: localizedObj
    });
  };

  const getLocalizedValue = (field: string): string => {
    const value = content[field as keyof HeroContent];
    if (!value) return '';
    // Handle case where value is a string (from API)
    if (typeof value === 'string') {
      return value;
    }
    // Handle case where value is an object
    if (typeof value === 'object') {
      return (value as Record<string, string>)[activeLang] || '';
    }
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Variant Selector */}
      <div>
        <Label className="text-base font-semibold">Variante del Hero</Label>
        <p className="text-sm text-gray-500 mb-3">Selecciona el diseño que mejor se adapte a tu contenido</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {VARIANTS.map((variant) => {
            const Icon = variant.icon;
            const isActive = content.variant === variant.id;
            return (
              <button
                key={variant.id}
                onClick={() => updateField('variant', variant.id)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  isActive 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <Icon className={`w-5 h-5 mb-2 ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
                <div className={`text-sm font-medium ${isActive ? 'text-green-700' : 'text-gray-700'}`}>
                  {variant.label}
                </div>
                <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {variant.description}
                </div>
                {isActive && (
                  <Badge className="mt-2 bg-green-500 text-xs">Activo</Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Language Toggle */}
      <div className="flex items-center justify-between border-b pb-3">
        <Label className="text-base font-semibold">Contenido</Label>
        <div className="flex gap-2">
          <Button
            variant={activeLang === 'es' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveLang('es')}
            className={activeLang === 'es' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            Español
          </Button>
          <Button
            variant={activeLang === 'en' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveLang('en')}
            className={activeLang === 'en' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            English
          </Button>
        </div>
      </div>

      {/* Title (Common) */}
      <div className="space-y-2">
        <Label>Título Principal</Label>
        <Input
          value={getLocalizedValue('title')}
          onChange={(e) => updateLocalizedField('title', activeLang, e.target.value)}
          placeholder={`Título en ${activeLang === 'es' ? 'español' : 'inglés'}`}
        />
      </div>

      {/* Variant-specific content */}
      {content.variant === 'cards' && (
        <Accordion type="single" collapsible defaultValue="card1">
          <AccordionItem value="card1" className="border-green-200">
            <AccordionTrigger className="hover:no-underline hover:bg-green-50 px-4 rounded-t-lg">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: content.card1_color }}></span>
                Tarjeta 1 - Principal
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="grid md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    Título
                    <FieldTooltip content="Título que aparecerá en la tarjeta" example="Vía Recreativa" />
                  </Label>
                  <Input
                    value={getLocalizedValue('card1_title')}
                    onChange={(e) => updateLocalizedField('card1_title', activeLang, e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    Color
                    <FieldTooltip content="Color de fondo de la tarjeta en formato HEX" example="#FF6B6B" />
                  </Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={content.card1_color}
                      onChange={(e) => updateField('card1_color', e.target.value)}
                      className="w-12 h-10 rounded border cursor-pointer"
                    />
                    <Input
                      value={content.card1_color}
                      onChange={(e) => updateField('card1_color', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="flex items-center gap-1">
                    Descripción
                    <FieldTooltip content="Breve descripción que aparecerá debajo del título" example="Ocupación temporal de vialidades" />
                  </Label>
                  <Textarea
                    value={getLocalizedValue('card1_description')}
                    onChange={(e) => updateLocalizedField('card1_description', activeLang, e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    Texto del Botón
                    <FieldTooltip content="Texto que aparecerá en el botón" example="Ver más" />
                  </Label>
                  <Input
                    value={getLocalizedValue('card1_button_text')}
                    onChange={(e) => updateLocalizedField('card1_button_text', activeLang, e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    URL del Botón
                    <FieldTooltip content="Página a la que dirigirá el botón" example="/registro" />
                  </Label>
                  <Input
                    value={getLocalizedValue('card1_url')}
                    onChange={(e) => updateLocalizedField('card1_url', activeLang, e.target.value)}
                    placeholder="/registro"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="flex items-center gap-1">
                    Imagen
                    <FieldTooltip content="URL de la imagen. Usa imágenes de al menos 400x300px" example="/images/landing/hero-1.png" />
                  </Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      value={content.card1_image || ''}
                      onChange={(e) => updateField('card1_image', e.target.value)}
                      placeholder="/images/landing/hero-1.png"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleUploadClick('card1_image')}
                      disabled={uploadingField === 'card1_image'}
                    >
                      {uploadingField === 'card1_image' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="card2" className="border-green-200">
            <AccordionTrigger className="hover:no-underline hover:bg-green-50 px-4">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: content.card2_color }}></span>
                Tarjeta 2 - Secundaria
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="grid md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input
                    value={getLocalizedValue('card2_title')}
                    onChange={(e) => updateLocalizedField('card2_title', activeLang, e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={content.card2_color}
                      onChange={(e) => updateField('card2_color', e.target.value)}
                      className="w-12 h-10 rounded border cursor-pointer"
                    />
                    <Input
                      value={content.card2_color}
                      onChange={(e) => updateField('card2_color', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Descripción</Label>
                  <Textarea
                    value={getLocalizedValue('card2_description')}
                    onChange={(e) => updateLocalizedField('card2_description', activeLang, e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Texto del Botón</Label>
                  <Input
                    value={getLocalizedValue('card2_button_text')}
                    onChange={(e) => updateLocalizedField('card2_button_text', activeLang, e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>URL del Botón</Label>
                  <Input
                    value={getLocalizedValue('card2_url')}
                    onChange={(e) => updateLocalizedField('card2_url', activeLang, e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Imagen</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      value={content.card2_image || ''}
                      onChange={(e) => updateField('card2_image', e.target.value)}
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleUploadClick('card2_image')}
                      disabled={uploadingField === 'card2_image'}
                    >
                      {uploadingField === 'card2_image' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="card3" className="border-green-200">
            <AccordionTrigger className="hover:no-underline hover:bg-green-50 px-4">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: content.card3_color }}></span>
                Tarjeta 3 - Terciaria
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="grid md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input
                    value={getLocalizedValue('card3_title')}
                    onChange={(e) => updateLocalizedField('card3_title', activeLang, e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={content.card3_color}
                      onChange={(e) => updateField('card3_color', e.target.value)}
                      className="w-12 h-10 rounded border cursor-pointer"
                    />
                    <Input
                      value={content.card3_color}
                      onChange={(e) => updateField('card3_color', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Descripción</Label>
                  <Textarea
                    value={getLocalizedValue('card3_description')}
                    onChange={(e) => updateLocalizedField('card3_description', activeLang, e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Texto del Botón</Label>
                  <Input
                    value={getLocalizedValue('card3_button_text')}
                    onChange={(e) => updateLocalizedField('card3_button_text', activeLang, e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>URL del Botón</Label>
                  <Input
                    value={getLocalizedValue('card3_url')}
                    onChange={(e) => updateLocalizedField('card3_url', activeLang, e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Imagen</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      value={content.card3_image || ''}
                      onChange={(e) => updateField('card3_image', e.target.value)}
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleUploadClick('card3_image')}
                      disabled={uploadingField === 'card3_image'}
                    >
                      {uploadingField === 'card3_image' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {content.variant === 'video' && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700">Configuración de Video</h3>
          <div className="space-y-2">
            <Label>Video de Fondo (URL)</Label>
            <div className="flex gap-2 items-center">
              <Input
                value={content.video_background || ''}
                onChange={(e) => updateField('video_background', e.target.value)}
                placeholder="/videos/hero-background.mp4"
              />
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Texto Overlay</Label>
            <Textarea
              value={getLocalizedValue('video_overlay_text')}
              onChange={(e) => updateLocalizedField('video_overlay_text', activeLang, e.target.value)}
              rows={4}
            />
          </div>
        </div>
      )}

      {content.variant === 'centered' && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700">Configuración Centrado</h3>
          <div className="space-y-2">
            <Label>Texto del Botón CTA</Label>
            <Input
              value={getLocalizedValue('centered_cta_text')}
              onChange={(e) => updateLocalizedField('centered_cta_text', activeLang, e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>URL del Botón</Label>
            <Input
              value={getLocalizedValue('centered_cta_url')}
              onChange={(e) => updateLocalizedField('centered_cta_url', activeLang, e.target.value)}
            />
          </div>
        </div>
      )}

      {content.variant === 'split' && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700">Configuración Dividido</h3>
          <div className="space-y-2">
            <Label>Posición de Imagen</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="split_position"
                  checked={content.split_image_position === 'left'}
                  onChange={() => updateField('split_image_position', 'left')}
                />
                Izquierda
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="split_position"
                  checked={content.split_image_position === 'right'}
                  onChange={() => updateField('split_image_position', 'right')}
                />
                Derecha
              </label>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Imagen</Label>
            <div className="flex gap-2 items-center">
              <Input
                value={content.split_image || ''}
                onChange={(e) => updateField('split_image', e.target.value)}
              />
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Minimal variant - no extra fields needed */}

      {/* Save Button */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          onClick={onSave}
          disabled={isSaving}
          className="bg-green-600 hover:bg-green-700"
        >
          {isSaving ? (
            <>Guardando...</>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default HeroEditor;
export type { HeroContent, HeroEditorProps };

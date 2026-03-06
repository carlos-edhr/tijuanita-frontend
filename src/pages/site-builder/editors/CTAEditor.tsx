import React, { useState, useCallback } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Card } from "../../../components/ui/card";
import { Save } from "lucide-react";
import type { Language } from "../lib/useLocalization";

interface CTAContent {
  id?: number;
  title: { es: string; en: string };
  description: { es: string; en: string };
  button_text: { es: string; en: string };
  button_url: { es: string; en: string };
  background_color: string;
}

interface CTAEditorProps {
  content: CTAContent;
  onChange: (content: CTAContent) => void;
  onSave: () => void;
  isSaving: boolean;
}

const DEFAULT_CTA_CONTENT: CTAContent = Object.freeze({
  title: { es: 'Únete a nuestra comunidad', en: 'Join our community' },
  description: { es: 'Participa en Vía Recreativa y ayuda a transformar los espacios públicos de Tijuana.', en: 'Participate in Vía Recreativa and help transform public spaces in Tijuana.' },
  button_text: { es: 'Regístrate ahora', en: 'Sign up now' },
  button_url: { es: '/registro', en: '/registro' },
  background_color: '#4ECDC4',
});

function mergeWithDefaults(content: CTAContent): CTAContent {
  return {
    ...DEFAULT_CTA_CONTENT,
    ...content,
    title: { ...DEFAULT_CTA_CONTENT.title, ...content.title },
    description: { ...DEFAULT_CTA_CONTENT.description, ...content.description },
    button_text: { ...DEFAULT_CTA_CONTENT.button_text, ...content.button_text },
    button_url: { ...DEFAULT_CTA_CONTENT.button_url, ...content.button_url },
  };
}

const CTAEditor: React.FC<CTAEditorProps> = ({ content, onChange, onSave, isSaving }) => {
  const [activeLang, setActiveLang] = useState<Language>('es');
  
  const data = mergeWithDefaults(content);

  const handleFieldChange = useCallback((field: keyof CTAContent, value: unknown) => {
    onChange({ ...data, [field]: value });
  }, [data, onChange]);

  const handleLocalizedFieldChange = useCallback((field: keyof CTAContent, lang: Language, value: string) => {
    const current = data[field];
    if (current && typeof current === 'object' && current !== null) {
      onChange({
        ...data,
        [field]: { ...(current as Record<string, string>), [lang]: value },
      });
    }
  }, [data, onChange]);

  const getLocalizedValue = useCallback((field: keyof CTAContent): string => {
    const value = data[field];
    if (value && typeof value === 'object' && value !== null) {
      return (value as Record<string, string>)[activeLang] || '';
    }
    return '';
  }, [data, activeLang]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-3">
        <Label className="text-base font-semibold">Sección Llamada a la Acción</Label>
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

      <Card className="p-4 bg-gray-50">
        <h4 className="font-semibold mb-4">Contenido</h4>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Título</Label>
            <Input
              value={getLocalizedValue('title')}
              onChange={(e) => handleLocalizedFieldChange('title', activeLang, e.target.value)}
              placeholder={`Título en ${activeLang === 'es' ? 'español' : 'inglés'}`}
            />
          </div>
          <div className="space-y-2">
            <Label>Descripción</Label>
            <Textarea
              value={getLocalizedValue('description')}
              onChange={(e) => handleLocalizedFieldChange('description', activeLang, e.target.value)}
              placeholder={`Descripción en ${activeLang === 'es' ? 'español' : 'inglés'}`}
              rows={3}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Texto del Botón</Label>
              <Input
                value={getLocalizedValue('button_text')}
                onChange={(e) => handleLocalizedFieldChange('button_text', activeLang, e.target.value)}
                placeholder="Texto del botón"
              />
            </div>
            <div className="space-y-2">
              <Label>URL del Botón</Label>
              <Input
                value={getLocalizedValue('button_url')}
                onChange={(e) => handleLocalizedFieldChange('button_url', activeLang, e.target.value)}
                placeholder="/registro"
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-gray-50">
        <h4 className="font-semibold mb-4">Diseño</h4>
        <div className="space-y-2">
          <Label>Color de Fondo</Label>
          <div className="flex gap-2">
            <input
              type="color"
              value={data.background_color}
              onChange={(e) => handleFieldChange('background_color', e.target.value)}
              className="w-12 h-10 rounded border cursor-pointer"
              aria-label="Color de fondo"
            />
            <Input
              value={data.background_color}
              onChange={(e) => handleFieldChange('background_color', e.target.value)}
              className="flex-1"
              placeholder="#4ECDC4"
            />
          </div>
        </div>
      </Card>

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

const CTAEditorMemoized = React.memo(CTAEditor);
CTAEditorMemoized.displayName = 'CTAEditor';

export default CTAEditorMemoized;
export type { CTAContent, CTAEditorProps };

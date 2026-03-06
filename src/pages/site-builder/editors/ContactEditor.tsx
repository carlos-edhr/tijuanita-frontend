import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Save, Upload } from "lucide-react";

interface ContactContent {
  id?: number;
  title: { es: string; en: string };
  subtitle: { es: string; en: string };
  email_label: { es: string; en: string };
  phone_label: { es: string; en: string };
  address_label: { es: string; en: string };
  form_title: { es: string; en: string };
  form_button_text: { es: string; en: string };
  map_embed: string | null;
}

interface ContactEditorProps {
  content: ContactContent;
  onChange: (content: ContactContent) => void;
  onSave: () => void;
  isSaving: boolean;
}

const defaultContactContent: ContactContent = {
  title: { es: 'Contáctanos', en: 'Contact Us' },
  subtitle: { es: 'Estamos aquí para responder tus preguntas y escuchar tus ideas.', en: 'We are here to answer your questions and listen to your ideas.' },
  email_label: { es: 'Email', en: 'Email' },
  phone_label: { es: 'Teléfono', en: 'Phone' },
  address_label: { es: 'Ubicación', en: 'Location' },
  form_title: { es: 'Envíanos un mensaje', en: 'Send us a message' },
  form_button_text: { es: 'Enviar Mensaje', en: 'Send Message' },
  map_embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d107708.09148592196!2d-117.0886642!3d32.47595855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80d94a5e62f4acdb%3A0x3b23ad35551e860a!2sPlayas%20De%20Tijuana%2C%20B.C.!5e0!3m2!1ses!2smx!4v1750959707546!5m2!1ses!2smx',
};

const ContactEditor: React.FC<ContactEditorProps> = ({ content, onChange, onSave, isSaving }) => {
  const [activeLang, setActiveLang] = useState<'es' | 'en'>('es');

  const data = { ...defaultContactContent, ...content };

  const updateField = (field: string, value: unknown) => {
    onChange({ ...data, [field]: value });
  };

  const updateLocalizedField = (field: string, lang: 'es' | 'en', value: string) => {
    const current = data[field as keyof ContactContent];
    if (current && typeof current === 'object') {
      onChange({
        ...data,
        [field]: { ...(current as object), [lang]: value }
      });
    }
  };

  const getLocalizedValue = (field: string): string => {
    const value = data[field as keyof ContactContent];
    if (value && typeof value === 'object') {
      return (value as Record<string, string>)[activeLang] || '';
    }
    return '';
  };

  return (
    <div className="space-y-6">
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

      {/* Title */}
      <div className="space-y-2">
        <Label>Título de la Sección</Label>
        <Input
          value={getLocalizedValue('title')}
          onChange={(e) => updateLocalizedField('title', activeLang, e.target.value)}
          placeholder={`Título en ${activeLang === 'es' ? 'español' : 'inglés'}`}
        />
      </div>

      {/* Subtitle */}
      <div className="space-y-2">
        <Label>Subtítulo</Label>
        <Textarea
          value={getLocalizedValue('subtitle')}
          onChange={(e) => updateLocalizedField('subtitle', activeLang, e.target.value)}
          placeholder={`Subtítulo en ${activeLang === 'es' ? 'español' : 'inglés'}`}
          rows={3}
        />
      </div>

      {/* Contact Info Labels */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Label de Email</Label>
          <Input
            value={getLocalizedValue('email_label')}
            onChange={(e) => updateLocalizedField('email_label', activeLang, e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Label de Teléfono</Label>
          <Input
            value={getLocalizedValue('phone_label')}
            onChange={(e) => updateLocalizedField('phone_label', activeLang, e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Label de Dirección</Label>
          <Input
            value={getLocalizedValue('address_label')}
            onChange={(e) => updateLocalizedField('address_label', activeLang, e.target.value)}
          />
        </div>
      </div>

      {/* Form Settings */}
      <Card className="p-4 bg-gray-50">
        <h4 className="font-semibold mb-4">Configuración del Formulario</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Título del Formulario</Label>
            <Input
              value={getLocalizedValue('form_title')}
              onChange={(e) => updateLocalizedField('form_title', activeLang, e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Texto del Botón</Label>
            <Input
              value={getLocalizedValue('form_button_text')}
              onChange={(e) => updateLocalizedField('form_button_text', activeLang, e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Map Embed */}
      <div className="space-y-2">
        <Label>Google Maps Embed URL</Label>
        <Input
          value={data.map_embed || ''}
          onChange={(e) => updateField('map_embed', e.target.value)}
          placeholder="URL del embed de Google Maps"
        />
        <p className="text-xs text-gray-500">Copia la URL del embed desde Google Maps</p>
      </div>

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

export default ContactEditor;
export type { ContactContent, ContactEditorProps };

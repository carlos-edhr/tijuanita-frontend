import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Card } from "../../../components/ui/card";
import { Save } from "lucide-react";

interface FooterContent {
  id?: number;
  copyright_text: { es: string; en: string };
  privacy_policy_url: { es: string; en: string };
  terms_url: { es: string; en: string };
  facebook_url: { es: string; en: string };
  instagram_url: { es: string; en: string };
  twitter_url: { es: string; en: string };
}

interface FooterEditorProps {
  content: FooterContent;
  onChange: (content: FooterContent) => void;
  onSave: () => void;
  isSaving: boolean;
}

const defaultFooterContent: FooterContent = {
  copyright_text: { es: '© 2026 Tijuanita Mi Ciudad. Todos los derechos reservados.', en: '© 2026 Tijuanita Mi Ciudad. All rights reserved.' },
  privacy_policy_url: { es: '/privacidad', en: '/privacy' },
  terms_url: { es: '/terminos', en: '/terms' },
  facebook_url: { es: 'https://facebook.com/tijuanitamiciudad', en: 'https://facebook.com/tijuanitamiciudad' },
  instagram_url: { es: 'https://instagram.com/tijuanitamiciudad', en: 'https://instagram.com/tijuanitamiciudad' },
  twitter_url: { es: '', en: '' },
};

const FooterEditor: React.FC<FooterEditorProps> = ({ content, onChange, onSave, isSaving }) => {
  const [activeLang, setActiveLang] = useState<'es' | 'en'>('es');

  const data = { ...defaultFooterContent, ...content };

  const updateField = (field: string, value: unknown) => {
    onChange({ ...data, [field]: value });
  };

  const updateLocalizedField = (field: string, lang: 'es' | 'en', value: string) => {
    const current = data[field as keyof FooterContent];
    if (current && typeof current === 'object') {
      onChange({
        ...data,
        [field]: { ...(current as object), [lang]: value }
      });
    }
  };

  const getLocalizedValue = (field: string): string => {
    const value = data[field as keyof FooterContent];
    if (value && typeof value === 'object') {
      return (value as Record<string, string>)[activeLang] || '';
    }
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Language Toggle */}
      <div className="flex items-center justify-between border-b pb-3">
        <Label className="text-base font-semibold">Contenido del Pie de Página</Label>
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

      {/* Copyright */}
      <div className="space-y-2">
        <Label>Texto de Copyright</Label>
        <Input
          value={getLocalizedValue('copyright_text')}
          onChange={(e) => updateLocalizedField('copyright_text', activeLang, e.target.value)}
          placeholder="Texto de copyright"
        />
      </div>

      {/* Legal Links */}
      <Card className="p-4 bg-gray-50">
        <h4 className="font-semibold mb-4">Enlaces Legales</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>URL de Política de Privacidad</Label>
            <Input
              value={getLocalizedValue('privacy_policy_url')}
              onChange={(e) => updateLocalizedField('privacy_policy_url', activeLang, e.target.value)}
              placeholder="/privacidad"
            />
          </div>
          <div className="space-y-2">
            <Label>URL de Términos y Condiciones</Label>
            <Input
              value={getLocalizedValue('terms_url')}
              onChange={(e) => updateLocalizedField('terms_url', activeLang, e.target.value)}
              placeholder="/terminos"
            />
          </div>
        </div>
      </Card>

      {/* Social Media */}
      <Card className="p-4 bg-gray-50">
        <h4 className="font-semibold mb-4">Redes Sociales</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Facebook URL</Label>
            <Input
              value={getLocalizedValue('facebook_url')}
              onChange={(e) => updateLocalizedField('facebook_url', activeLang, e.target.value)}
              placeholder="https://facebook.com/..."
            />
          </div>
          <div className="space-y-2">
            <Label>Instagram URL</Label>
            <Input
              value={getLocalizedValue('instagram_url')}
              onChange={(e) => updateLocalizedField('instagram_url', activeLang, e.target.value)}
              placeholder="https://instagram.com/..."
            />
          </div>
          <div className="space-y-2">
            <Label>Twitter/X URL</Label>
            <Input
              value={getLocalizedValue('twitter_url')}
              onChange={(e) => updateLocalizedField('twitter_url', activeLang, e.target.value)}
              placeholder="https://x.com/..."
            />
          </div>
        </div>
      </Card>

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

export default FooterEditor;
export type { FooterContent, FooterEditorProps };

import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { 
  GripVertical, 
  ChevronUp, 
  ChevronDown,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Save
} from "lucide-react";

type SectionKey = 'navbar' | 'hero' | 'quees' | 'whoweare' | 'gallery' | 'contact' | 'footer' | 'cta';

interface SectionItem {
  key: SectionKey;
  label: string;
  icon: string;
  enabled: boolean;
  order: number;
}

interface SectionReorderProps {
  sections: SectionItem[];
  onChange: (sections: SectionItem[]) => void;
  onSave: () => void;
  isSaving: boolean;
}

const DEFAULT_SECTIONS: SectionItem[] = [
  { key: 'navbar', label: 'Barra de Navegación', icon: '☰', enabled: true, order: 0 },
  { key: 'hero', label: 'Hero (Portada)', icon: '🎯', enabled: true, order: 1 },
  { key: 'quees', label: '¿Qué es?', icon: '❓', enabled: true, order: 2 },
  { key: 'whoweare', label: '¿Quiénes Somos?', icon: '👥', enabled: true, order: 3 },
  { key: 'gallery', label: 'Galería', icon: '🖼️', enabled: true, order: 4 },
  { key: 'contact', label: 'Contacto', icon: '📧', enabled: true, order: 5 },
  { key: 'footer', label: 'Pie de Página', icon: '📝', enabled: true, order: 6 },
  { key: 'cta', label: 'Llamada a la Acción', icon: '📢', enabled: false, order: 7 },
];

const SectionReorder: React.FC<SectionReorderProps> = ({ sections, onChange, isSaving }) => {
  const [localSections, setLocalSections] = useState<SectionItem[]>(
    sections.length > 0 ? sections : DEFAULT_SECTIONS
  );

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...localSections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newSections.length) return;
    
    // Swap
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    
    // Update order
    newSections.forEach((s, i) => s.order = i);
    setLocalSections(newSections);
    onChange(newSections);
  };

  const toggleSection = (key: SectionKey) => {
    const newSections = localSections.map(s => 
      s.key === key ? { ...s, enabled: !s.enabled } : s
    );
    setLocalSections(newSections);
    onChange(newSections);
  };

  const sortedSections = [...localSections].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Secciones de la Página</h3>
          <p className="text-sm text-gray-500">Activa/desactiva y reordena las secciones</p>
        </div>
      </div>

      <div className="space-y-2">
        {sortedSections.map((section, index) => (
          <Card 
            key={section.key}
            className={`p-3 transition-all ${
              section.enabled 
                ? 'border-green-200 bg-white' 
                : 'border-gray-200 bg-gray-50 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Drag Handle */}
              <div className="cursor-grab text-gray-400 hover:text-gray-600">
                <GripVertical className="w-5 h-5" />
              </div>
              
              {/* Order Buttons */}
              <div className="flex flex-col">
                <button
                  onClick={() => moveSection(index, 'up')}
                  disabled={index === 0}
                  className="p-0.5 hover:bg-gray-100 rounded disabled:opacity-30"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveSection(index, 'down')}
                  disabled={index === sortedSections.length - 1}
                  className="p-0.5 hover:bg-gray-100 rounded disabled:opacity-30"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              
              {/* Icon & Label */}
              <div className="text-xl">{section.icon}</div>
              <div className="flex-1">
                <div className="font-medium">{section.label}</div>
                <div className="text-xs text-gray-500">Orden: {index + 1}</div>
              </div>
              
              {/* Enable/Disable Toggle */}
              <Button
                variant={section.enabled ? "default" : "outline"}
                size="sm"
                onClick={() => toggleSection(section.key)}
                className={section.enabled ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {section.enabled ? (
                  <><Eye className="w-4 h-4 mr-1" /> Visible</>
                ) : (
                  <><EyeOff className="w-4 h-4 mr-1" /> Oculto</>
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add CTA Section hint */}
      {!localSections.find(s => s.key === 'cta')?.enabled && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-blue-700">
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">
              ¿Quieres añadir una sección de Llamada a la Acción?
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionReorder;
export type { SectionItem, SectionReorderProps };

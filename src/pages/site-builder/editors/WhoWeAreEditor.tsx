import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Card } from "../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { cmsService, type CMSTeamMember } from "../../../services/cmsService";
import { toast } from "sonner";
import { Save, Upload, Loader2, Plus, Trash2, Edit, GripVertical } from "lucide-react";

interface WhoWeAreContent {
  id?: number;
  title: { es: string; en: string };
  content: { es: string; en: string };
  image: string | null;
}

interface WhoWeAreEditorProps {
  content: WhoWeAreContent;
  onChange: (content: WhoWeAreContent) => void;
  onSave: () => void;
  isSaving: boolean;
  teamMembers?: CMSTeamMember[];
  onAddTeamMember?: (member: Partial<CMSTeamMember>) => Promise<void>;
  onUpdateTeamMember?: (id: number, member: Partial<CMSTeamMember>) => Promise<void>;
  onDeleteTeamMember?: (id: number) => Promise<void>;
  onReorderTeamMembers?: (members: CMSTeamMember[]) => Promise<void>;
}

const defaultWhoWeAreContent: WhoWeAreContent = {
  title: { es: 'Who We Are', en: 'About Us' },
  content: { es: 'Somos una organización dedicada a transformar los espacios públicos de Tijuana para crear oportunidades de juego y crecimiento para la infancia.', en: 'We are an organization dedicated to transforming public spaces in Tijuana to create opportunities for play and growth for children.' },
  image: '/images/landing/whoweare.png',
};

const WhoWeAreEditor: React.FC<WhoWeAreEditorProps> = ({ 
  content, 
  onChange, 
  onSave, 
  isSaving,
  teamMembers = [],
  onAddTeamMember,
  onUpdateTeamMember,
  onDeleteTeamMember,
  onReorderTeamMembers
}) => {
  const [activeLang, setActiveLang] = useState<'es' | 'en'>('es');
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'team'>('content');
  const [editingMember, setEditingMember] = useState<CMSTeamMember | null>(null);
  const [newMember, setNewMember] = useState<Partial<CMSTeamMember>>({
    name: { es: '', en: '' },
    role: { es: '', en: '' },
    bio: { es: '', en: '' },
    photo: null,
    email: null,
    order: teamMembers.length
  });
  
  const data = { ...defaultWhoWeAreContent, ...content };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const result = await cmsService.uploadImage(file);
      onChange({ ...data, image: result.url });
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

  const updateField = (field: string, value: unknown) => onChange({ ...data, [field]: value });
  const updateLocalizedField = (field: string, lang: 'es' | 'en', value: string) => {
    const current = data[field as keyof WhoWeAreContent];
    if (current && typeof current === 'object') onChange({ ...data, [field]: { ...(current as object), [lang]: value } });
  };
  const getLocalizedValue = (field: string): string => {
    const value = data[field as keyof WhoWeAreContent];
    return value && typeof value === 'object' ? (value as Record<string, string>)[activeLang] || '' : '';
  };

  const handleAddMember = async () => {
    if (!onAddTeamMember) return;
    await onAddTeamMember(newMember);
    setNewMember({
      name: { es: '', en: '' },
      role: { es: '', en: '' },
      bio: { es: '', en: '' },
      photo: null,
      email: null,
      order: teamMembers.length + 1
    });
  };

  const handleUpdateMember = async () => {
    if (!editingMember || !onUpdateTeamMember || !editingMember.id) return;
    await onUpdateTeamMember(editingMember.id, editingMember);
    setEditingMember(null);
  };

  const handleDeleteMember = async (id: number) => {
    if (!onDeleteTeamMember) return;
    if (window.confirm('¿Estás seguro de eliminar este miembro?')) {
      await onDeleteTeamMember(id);
    }
  };

  const handleMemberPhotoUpload = async (file: File, member: CMSTeamMember) => {
    try {
      const result = await cmsService.uploadImage(file);
      if (member.id && onUpdateTeamMember) {
        await onUpdateTeamMember(member.id, { ...member, photo: result.url });
      }
      toast.success('Foto subida correctamente');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Error al subir la foto');
    }
  };

  const ContentEditor = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-3">
        <Label className="text-base font-semibold">Sección Who We Are</Label>
        <div className="flex gap-2">
          <Button variant={activeLang === 'es' ? 'default' : 'outline'} size="sm" onClick={() => setActiveLang('es')} className={activeLang === 'es' ? 'bg-green-600' : ''}>Español</Button>
          <Button variant={activeLang === 'en' ? 'default' : 'outline'} size="sm" onClick={() => setActiveLang('en')} className={activeLang === 'en' ? 'bg-green-600' : ''}>English</Button>
        </div>
      </div>
      <div className="space-y-2"><Label>Título</Label><Input value={getLocalizedValue('title')} onChange={(e) => updateLocalizedField('title', activeLang, e.target.value)} /></div>
      <div className="space-y-2"><Label>Contenido</Label><Textarea value={getLocalizedValue('content')} onChange={(e) => updateLocalizedField('content', activeLang, e.target.value)} rows={5} /></div>
      <div className="space-y-2"><Label>Imagen</Label><div className="flex gap-2"><Input value={data.image || ''} onChange={(e) => updateField('image', e.target.value)} placeholder="/images/..." className="flex-1" /><Button variant="outline" size="sm" onClick={handleUploadClick} disabled={uploading}>{uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}</Button></div></div>
    </div>
  );

  const TeamMembersEditor = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-3">
        <Label className="text-base font-semibold">Miembros del Equipo</Label>
        <Button size="sm" onClick={() => setActiveTab('content')}>Volver a Contenido</Button>
      </div>
      
      {/* Add new member form */}
      <Card className="p-4">
        <h4 className="font-semibold mb-4">Agregar Nuevo Miembro</h4>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nombre (ES)</Label>
              <Input value={newMember.name?.es || ''} onChange={(e) => setNewMember({...newMember, name: { ...newMember.name, es: e.target.value }})} />
            </div>
            <div className="space-y-2">
              <Label>Nombre (EN)</Label>
              <Input value={newMember.name?.en || ''} onChange={(e) => setNewMember({...newMember, name: { ...newMember.name, en: e.target.value }})} />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Rol (ES)</Label>
              <Input value={newMember.role?.es || ''} onChange={(e) => setNewMember({...newMember, role: { ...newMember.role, es: e.target.value }})} />
            </div>
            <div className="space-y-2">
              <Label>Rol (EN)</Label>
              <Input value={newMember.role?.en || ''} onChange={(e) => setNewMember({...newMember, role: { ...newMember.role, en: e.target.value }})} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Biografía (ES)</Label>
            <Textarea value={newMember.bio?.es || ''} onChange={(e) => setNewMember({...newMember, bio: { ...newMember.bio, es: e.target.value }})} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Biografía (EN)</Label>
            <Textarea value={newMember.bio?.en || ''} onChange={(e) => setNewMember({...newMember, bio: { ...newMember.bio, en: e.target.value }})} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={newMember.email || ''} onChange={(e) => setNewMember({...newMember, email: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Foto URL</Label>
            <div className="flex gap-2">
              <Input value={newMember.photo || ''} onChange={(e) => setNewMember({...newMember, photo: e.target.value})} placeholder="/images/..." />
              <Button variant="outline" size="sm" onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = async (e) => {
                  const target = e.target as HTMLInputElement;
                  if (target.files && target.files[0]) {
                    try {
                      const result = await cmsService.uploadImage(target.files[0]);
                      setNewMember({...newMember, photo: result.url});
                    } catch (error) {
                      toast.error('Error al subir la foto');
                    }
                  }
                };
                input.click();
              }}><Upload className="w-4 h-4" /></Button>
            </div>
          </div>
          <Button onClick={handleAddMember} disabled={!onAddTeamMember}><Plus className="w-4 h-4 mr-2" /> Agregar Miembro</Button>
        </div>
      </Card>

      {/* List of existing members */}
      <div className="space-y-4">
        <h4 className="font-semibold">Miembros Existentes ({teamMembers.length})</h4>
        {teamMembers.length === 0 ? (
          <p className="text-gray-500 italic">No hay miembros agregados aún.</p>
        ) : (
          <div className="space-y-3">
            {teamMembers.map((member) => (
              <Card key={member.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {member.photo && (
                      <img src={member.photo} alt={member.name?.es || ''} className="w-16 h-16 rounded-full object-cover" />
                    )}
                    <div>
                      <h5 className="font-semibold">{member.name?.es || ''} {member.name?.en && `(${member.name.en})`}</h5>
                      <p className="text-sm text-gray-600">{member.role?.es || ''}</p>
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">{member.bio?.es || ''}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingMember(member)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteMember(member.id!)}><Trash2 className="w-4 h-4" /></Button>
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
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'content' | 'team')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">Contenido</TabsTrigger>
          <TabsTrigger value="team">Miembros del Equipo</TabsTrigger>
        </TabsList>
        <TabsContent value="content">
          <ContentEditor />
        </TabsContent>
        <TabsContent value="team">
          <TeamMembersEditor />
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

export default WhoWeAreEditor;
export type { WhoWeAreContent, WhoWeAreEditorProps };

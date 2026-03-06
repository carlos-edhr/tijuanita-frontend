import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { toast } from "sonner";
import HeroEditor, { type HeroContent } from "./editors/HeroEditor";
import NavbarEditor, { type NavbarContent } from "./editors/NavbarEditor";
import QueEsEditor, { type QueEsContent } from "./editors/QueEsEditor";
import WhoWeAreEditor, { type WhoWeAreContent } from "./editors/WhoWeAreEditor";
import GalleryEditor, { type GalleryContent } from "./editors/GalleryEditor";
import ContactEditor, { type ContactContent } from "./editors/ContactEditor";
import FooterEditor, { type FooterContent } from "./editors/FooterEditor";
import CTAEditor, { type CTAContent } from "./editors/CTAEditor";
import SectionReorder from "./components/SectionReorder";
import WelcomeTour from "./components/WelcomeTour";
import { cmsService, type CMSConfig, type CMSTeamMember, type CMSGalleryImage } from "../../services/cmsService";
import AppFooter from "../../components/AppFooter";
import {
  DEFAULT_HERO_CONTENT,
  DEFAULT_NAVBAR_CONTENT,
  DEFAULT_QUEES_CONTENT,
  DEFAULT_WHOWEARE_CONTENT,
  DEFAULT_GALLERY_CONTENT,
  DEFAULT_CONTACT_CONTENT,
  DEFAULT_FOOTER_CONTENT,
  DEFAULT_CTA_CONTENT,
} from "./lib/defaultContent";
import { 
  Globe, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  EyeOff,
  Check,
  Loader2,
  AlertTriangle,
  Home,
  Layout,
  HelpCircle,
  Users,
  Image,
  Mail,
  FileText,
  Menu,
  X as CloseIcon,
  Undo,
  Redo,
  RefreshCw,
  Megaphone
} from "lucide-react";

type SectionKey = 'sections' | 'navbar' | 'hero' | 'quees' | 'whoweare' | 'gallery' | 'contact' | 'footer' | 'cta';

interface Section {
  key: SectionKey;
  label: string;
  icon: React.ElementType;
  description: string;
}

const SECTIONS: Section[] = [
  { key: 'sections', label: 'Secciones', icon: Layout, description: 'Reordena y muestra/oculta secciones' },
  { key: 'navbar', label: 'Navegación', icon: Menu, description: 'Barra de navegación principal' },
  { key: 'hero', label: 'Hero', icon: Home, description: 'Sección principal de portada' },
  { key: 'cta', label: 'Llamada a la Acción', icon: Megaphone, description: 'Banner de llamada a la acción' },
  { key: 'quees', label: '¿Qué es?', icon: HelpCircle, description: 'Sección informativa' },
  { key: 'whoweare', label: 'Nosotros', icon: Users, description: 'Información sobre la organización' },
  { key: 'gallery', label: 'Galería', icon: Image, description: 'Imágenes y contenido visual' },
  { key: 'contact', label: 'Contacto', icon: Mail, description: 'Formulario y información de contacto' },
  { key: 'footer', label: 'Pie de página', icon: FileText, description: 'Footer y enlaces legales' },
];

// Helper function to convert string values to localized object format
// API returns strings but editor expects { es: string, en: string }
function toLocalizedValue(value: string | { es: string; en: string } | null | undefined): { es: string; en: string } {
  if (!value) return { es: '', en: '' };
  if (typeof value === 'string') {
    // Assume the string is in Spanish, use empty for English
    return { es: value, en: '' };
  }
  if (typeof value === 'object') {
    return value;
  }
  return { es: '', en: '' };
}

// Initial content for tracking changes
const initialHeroContent: HeroContent = {
  variant: 'cards',
  title: { es: 'Tijuanita mi ciudad', en: 'Tijuanita my city' },
  card1_title: { es: 'Vía recreativa', en: 'Recreational path' },
  card1_description: { es: 'Ocupación temporal de vialidades', en: 'Temporary street occupation' },
  card1_button_text: { es: 'Reporte', en: 'Report' },
  card1_image: '/images/landing/hero-1.png',
  card1_video: null,
  card1_color: '#FF6B6B',
  card1_url: { es: '/registro', en: '/registro' },
  card2_title: { es: 'Convocatoria', en: 'Call' },
  card2_description: { es: 'Convocatoria a voluntarios', en: 'Call for volunteers' },
  card2_button_text: { es: 'Registro de Voluntarios', en: 'Volunteer Registration' },
  card2_image: '/images/landing/hero-2.png',
  card2_color: '#4ECDC4',
  card2_url: { es: '/voluntarios', en: '/voluntarios' },
  card3_title: { es: 'Vía Recreativa', en: 'Recreational Path' },
  card3_description: { es: 'Registro de asistentes', en: 'Attendance registration' },
  card3_button_text: { es: 'Registro de Asistentes', en: 'Attendee Registration' },
  card3_image: '/images/landing/hero-3.png',
  card3_color: '#FFCC5C',
  card3_url: { es: '/registro', en: '/registro' },
  video_background: null,
  video_overlay_text: { es: '', en: '' },
  centered_cta_text: { es: '', en: '' },
  centered_cta_url: { es: '', en: '' },
  split_image: null,
  split_image_position: 'right',
};

const initialNavbarContent: NavbarContent = {
  logo: '/images/landing/navbar2.png',
  logo_text: { es: 'Tijuanita Mi Ciudad', en: 'Tijuanita Mi Ciudad' },
  cta_text: { es: 'Iniciar Sesión', en: 'Login' },
  cta_link: { es: '/login', en: '/login' },
};

const initialQueEsContent: QueEsContent = {
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

const initialWhoWeAreContent: WhoWeAreContent = {
  title: { es: '¿Quiénes Somos?', en: 'About Us' },
  content: { es: 'Somos una organización dedicada a transformar los espacios públicos de Tijuana para crear oportunidades de juego y crecimiento para la infancia.', en: 'We are an organization dedicated to transforming public spaces in Tijuana to create opportunities for play and growth for children.' },
  image: '/images/landing/whoweare.png',
};

const initialGalleryContent: GalleryContent = {
  title: { es: 'Galería', en: 'Gallery' },
};

const initialContactContent: ContactContent = {
  title: { es: 'Contáctanos', en: 'Contact Us' },
  subtitle: { es: 'Estamos aquí para responder tus preguntas y escuchar tus ideas.', en: 'We are here to answer your questions and listen to your ideas.' },
  email_label: { es: 'Email', en: 'Email' },
  phone_label: { es: 'Teléfono', en: 'Phone' },
  address_label: { es: 'Ubicación', en: 'Location' },
  form_title: { es: 'Envíanos un mensaje', en: 'Send us a message' },
  form_button_text: { es: 'Enviar Mensaje', en: 'Send Message' },
  map_embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d107708.09148592196!2d-117.0886642!3d32.47595855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80d94a5e62f4acdb%3A0x3b23ad35551e860a!2sPlayas%20De%20Tijuana%2C%20B.C.!5e0!3m2!1ses!2smx!4v1750959707546!5m2!1ses!2smx',
};

const initialFooterContent: FooterContent = {
  copyright_text: { es: '© 2026 Tijuanita Mi Ciudad. Todos los derechos reservados.', en: '© 2026 Tijuanita Mi Ciudad. All rights reserved.' },
  privacy_policy_url: { es: '/privacidad', en: '/privacy' },
  terms_url: { es: '/terminos', en: '/terms' },
  facebook_url: { es: 'https://facebook.com/tijuanitamiciudad', en: 'https://facebook.com/tijuanitamiciudad' },
  instagram_url: { es: 'https://instagram.com/tijuanitamiciudad', en: 'https://instagram.com/tijuanitamiciudad' },
  twitter_url: { es: '', en: '' },
};

const initialCTAContent: CTAContent = {
  title: { es: 'Únete a nuestra comunidad', en: 'Join our community' },
  description: { es: 'Participa en Vía Recreativa y ayuda a transformar los espacios públicos de Tijuana.', en: 'Participate in Vía Recreativa and help transform public spaces in Tijuana.' },
  button_text: { es: 'Regístrate ahora', en: 'Sign up now' },
  button_url: { es: '/registro', en: '/registro' },
  background_color: '#4ECDC4',
};

const SiteBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logoutUser } = useAuth();
  
  const [selectedSection, setSelectedSection] = useState<SectionKey>('hero');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [previewKey, setPreviewKey] = useState(0);

  // Content states
  const [heroContent, setHeroContent] = useState<HeroContent>(initialHeroContent);
  const [navbarContent, setNavbarContent] = useState<NavbarContent>(initialNavbarContent);
  const [queesContent, setQueesContent] = useState<QueEsContent>(initialQueEsContent);
  const [whoweareContent, setWhoWeAreContent] = useState<WhoWeAreContent>(initialWhoWeAreContent);
  const [galleryContent, setGalleryContent] = useState<GalleryContent>(initialGalleryContent);
  const [contactContent, setContactContent] = useState<ContactContent>(initialContactContent);
  const [footerContent, setFooterContent] = useState<FooterContent>(initialFooterContent);
  const [ctaContent, setCtaContent] = useState<CTAContent>(initialCTAContent);
  const [teamMembers, setTeamMembers] = useState<CMSTeamMember[]>([]);
  const [galleryImages, setGalleryImages] = useState<CMSGalleryImage[]>([]);

  const [sections, setSections] = useState([
    { key: 'navbar', label: 'Barra de Navegación', icon: '☰', enabled: true, order: 0 },
    { key: 'hero', label: 'Hero (Portada)', icon: '🎯', enabled: true, order: 1 },
    { key: 'cta', label: 'Llamada a la Acción', icon: '📢', enabled: true, order: 2 },
    { key: 'quees', label: '¿Qué es?', icon: '❓', enabled: true, order: 3 },
    { key: 'whoweare', label: '¿Quiénes Somos?', icon: '👥', enabled: true, order: 4 },
    { key: 'gallery', label: 'Galería', icon: '🖼️', enabled: true, order: 5 },
    { key: 'contact', label: 'Contacto', icon: '📧', enabled: true, order: 6 },
    { key: 'footer', label: 'Pie de Página', icon: '📝', enabled: true, order: 7 },
  ]);

  const [isLoading, setIsLoading] = useState(true);

  const loadContentFromAPI = useCallback(async () => {
    setIsLoading(true);
    try {
      // Use preview endpoint to get the latest draft content
      const content = await cmsService.getLandingPageContent();
      
      if (content.navbar) {
        setNavbarContent({
          logo: content.navbar.logo || '/images/landing/navbar2.png',
          logo_text: toLocalizedValue(content.navbar.logo_text),
          cta_text: toLocalizedValue(content.navbar.cta_text),
          cta_link: toLocalizedValue(content.navbar.cta_link),
        });
      }
      
      if (content.hero) {
        setHeroContent({
          variant: content.hero.variant || 'cards',
          title: toLocalizedValue(content.hero.title),
          card1_title: toLocalizedValue(content.hero.card1_title),
          card1_description: toLocalizedValue(content.hero.card1_description),
          card1_button_text: toLocalizedValue(content.hero.card1_button_text),
          card1_image: content.hero.card1_image,
          card1_video: content.hero.card1_video,
          card1_color: content.hero.card1_color || '#FF6B6B',
          card1_url: toLocalizedValue(content.hero.card1_url),
          card2_title: toLocalizedValue(content.hero.card2_title),
          card2_description: toLocalizedValue(content.hero.card2_description),
          card2_button_text: toLocalizedValue(content.hero.card2_button_text),
          card2_image: content.hero.card2_image,
          card2_color: content.hero.card2_color || '#4ECDC4',
          card2_url: toLocalizedValue(content.hero.card2_url),
          card3_title: toLocalizedValue(content.hero.card3_title),
          card3_description: toLocalizedValue(content.hero.card3_description),
          card3_button_text: toLocalizedValue(content.hero.card3_button_text),
          card3_image: content.hero.card3_image,
          card3_color: content.hero.card3_color || '#FFCC5C',
          card3_url: toLocalizedValue(content.hero.card3_url),
          video_background: content.hero.video_background,
          video_overlay_text: toLocalizedValue(content.hero.video_overlay_text),
          centered_cta_text: toLocalizedValue(content.hero.centered_cta_text),
          centered_cta_url: toLocalizedValue(content.hero.centered_cta_url),
          split_image: content.hero.split_image,
          split_image_position: content.hero.split_image_position || 'right',
        });
      }
      
      if (content.quees) {
        setQueesContent({
          title: toLocalizedValue(content.quees.title),
          card1_title: toLocalizedValue(content.quees.card1_title),
          card1_description: toLocalizedValue(content.quees.card1_description),
          card1_button_text: toLocalizedValue(content.quees.card1_button_text),
          card1_image: content.quees.card1_image,
          card1_color: content.quees.card1_color || '#FF6B6B',
          card2_title: toLocalizedValue(content.quees.card2_title),
          card2_description: toLocalizedValue(content.quees.card2_description),
          card2_button_text: toLocalizedValue(content.quees.card2_button_text),
          card2_image: content.quees.card2_image,
          card2_color: content.quees.card2_color || '#4ECDC4',
          card3_title: toLocalizedValue(content.quees.card3_title),
          card3_description: toLocalizedValue(content.quees.card3_description),
          card3_button_text: toLocalizedValue(content.quees.card3_button_text),
          card3_image: content.quees.card3_image,
          card3_color: content.quees.card3_color || '#FFCC5C',
        });
      }
      
      if (content.whoweare) {
        setWhoWeAreContent({
          title: toLocalizedValue(content.whoweare.title),
          content: toLocalizedValue(content.whoweare.content),
          image: content.whoweare.image,
        });
      }
      
      if (content.gallery) {
        setGalleryContent({
          title: toLocalizedValue(content.gallery.title),
        });
      }
      
      if (content.contact) {
        setContactContent({
          title: toLocalizedValue(content.contact.title),
          subtitle: toLocalizedValue(content.contact.subtitle),
          email_label: toLocalizedValue(content.contact.email_label),
          phone_label: toLocalizedValue(content.contact.phone_label),
          address_label: toLocalizedValue(content.contact.address_label),
          form_title: toLocalizedValue(content.contact.form_title),
          form_button_text: toLocalizedValue(content.contact.form_button_text),
          map_embed: content.contact.map_embed,
        });
      }
      
      if (content.footer) {
        setFooterContent({
          copyright_text: toLocalizedValue(content.footer.copyright_text),
          privacy_policy_url: toLocalizedValue(content.footer.privacy_policy_url),
          terms_url: toLocalizedValue(content.footer.terms_url),
          facebook_url: toLocalizedValue(content.footer.facebook_url),
          instagram_url: toLocalizedValue(content.footer.instagram_url),
          twitter_url: toLocalizedValue(content.footer.twitter_url),
        });
      }

      // Load CTA content if available
      if (content.ctas && content.ctas.length > 0) {
        const cta = content.ctas[0];
        if (cta) {
          setCtaContent({
            title: toLocalizedValue(cta.title),
            description: toLocalizedValue(cta.description),
            button_text: toLocalizedValue(cta.button_text),
            button_url: toLocalizedValue(cta.button_url),
            background_color: cta.background_color || '#4ECDC4',
          });
        }
      }
      
       if (content.config) {
        const config = content.config;
        const ctaEnabled = config.cta_sections && config.cta_sections.length > 0;
        setSections([
          { key: 'navbar', label: 'Barra de Navegación', icon: '☰', enabled: config.navbar_enabled ?? true, order: 0 },
          { key: 'hero', label: 'Hero (Portada)', icon: '🎯', enabled: config.hero_enabled ?? true, order: 1 },
          { key: 'cta', label: 'Llamada a la Acción', icon: '📢', enabled: ctaEnabled, order: 2 },
          { key: 'quees', label: '¿Qué es?', icon: '❓', enabled: config.quees_enabled ?? true, order: 3 },
          { key: 'whoweare', label: '¿Quiénes Somos?', icon: '👥', enabled: config.whoweare_enabled ?? true, order: 4 },
          { key: 'gallery', label: 'Galería', icon: '🖼️', enabled: config.gallery_enabled ?? true, order: 5 },
          { key: 'contact', label: 'Contacto', icon: '📧', enabled: config.contact_enabled ?? true, order: 6 },
          { key: 'footer', label: 'Pie de Página', icon: '📝', enabled: config.footer_enabled ?? true, order: 7 },
        ]);
      }

      // Load team members
      let loadedTeamMembers = [];
      try {
        loadedTeamMembers = await cmsService.getTeamMembers();
      } catch (error) {
        console.warn('Failed to load team members:', error);
        // Continue with empty array
      }
      setTeamMembers(loadedTeamMembers);
      
      // Load gallery images
      let loadedGalleryImages = [];
      try {
        loadedGalleryImages = await cmsService.getGalleryImages();
      } catch (error) {
        console.warn('Failed to load gallery images:', error);
        // Continue with empty array
      }
      setGalleryImages(loadedGalleryImages);
      
      // Build content objects from API response to sync initial ref
      const loadedHeroContent = content.hero ? {
        variant: content.hero.variant || 'cards',
        title: content.hero.title || { es: '', en: '' },
        card1_title: content.hero.card1_title || { es: '', en: '' },
        card1_description: content.hero.card1_description || { es: '', en: '' },
        card1_button_text: content.hero.card1_button_text || { es: '', en: '' },
        card1_image: content.hero.card1_image,
        card1_video: content.hero.card1_video,
        card1_color: content.hero.card1_color || '#FF6B6B',
        card1_url: content.hero.card1_url || { es: '', en: '' },
        card2_title: content.hero.card2_title || { es: '', en: '' },
        card2_description: content.hero.card2_description || { es: '', en: '' },
        card2_button_text: content.hero.card2_button_text || { es: '', en: '' },
        card2_image: content.hero.card2_image,
        card2_color: content.hero.card2_color || '#4ECDC4',
        card2_url: content.hero.card2_url || { es: '', en: '' },
        card3_title: content.hero.card3_title || { es: '', en: '' },
        card3_description: content.hero.card3_description || { es: '', en: '' },
        card3_button_text: content.hero.card3_button_text || { es: '', en: '' },
        card3_image: content.hero.card3_image,
        card3_color: content.hero.card3_color || '#FFCC5C',
        card3_url: content.hero.card3_url || { es: '', en: '' },
        video_background: content.hero.video_background,
        video_overlay_text: content.hero.video_overlay_text || { es: '', en: '' },
        centered_cta_text: content.hero.centered_cta_text || { es: '', en: '' },
        centered_cta_url: content.hero.centered_cta_url || { es: '', en: '' },
        split_image: content.hero.split_image,
        split_image_position: content.hero.split_image_position || 'right',
      } : initialHeroContent;

      const loadedNavbarContent = content.navbar ? {
        logo: content.navbar.logo || '/images/landing/navbar2.png',
        logo_text: content.navbar.logo_text || { es: '', en: '' },
        cta_text: content.navbar.cta_text || { es: '', en: '' },
        cta_link: content.navbar.cta_link || { es: '', en: '' },
      } : initialNavbarContent;

      const loadedQueEsContent = content.quees ? {
        title: content.quees.title || { es: '', en: '' },
        card1_title: content.quees.card1_title || { es: '', en: '' },
        card1_description: content.quees.card1_description || { es: '', en: '' },
        card1_button_text: content.quees.card1_button_text || { es: '', en: '' },
        card1_image: content.quees.card1_image,
        card1_color: content.quees.card1_color || '#FF6B6B',
        card2_title: content.quees.card2_title || { es: '', en: '' },
        card2_description: content.quees.card2_description || { es: '', en: '' },
        card2_button_text: content.quees.card2_button_text || { es: '', en: '' },
        card2_image: content.quees.card2_image,
        card2_color: content.quees.card2_color || '#4ECDC4',
        card3_title: content.quees.card3_title || { es: '', en: '' },
        card3_description: content.quees.card3_description || { es: '', en: '' },
        card3_button_text: content.quees.card3_button_text || { es: '', en: '' },
        card3_image: content.quees.card3_image,
        card3_color: content.quees.card3_color || '#FFCC5C',
      } : initialQueEsContent;

      const loadedWhoWeAreContent = content.whoweare ? {
        title: content.whoweare.title || { es: '', en: '' },
        content: content.whoweare.content || { es: '', en: '' },
        image: content.whoweare.image,
      } : initialWhoWeAreContent;

      const loadedGalleryContent = content.gallery ? {
        title: content.gallery.title || { es: '', en: '' },
      } : initialGalleryContent;

      const loadedContactContent = content.contact ? {
        title: content.contact.title || { es: '', en: '' },
        subtitle: content.contact.subtitle || { es: '', en: '' },
        email_label: content.contact.email_label || { es: '', en: '' },
        phone_label: content.contact.phone_label || { es: '', en: '' },
        address_label: content.contact.address_label || { es: '', en: '' },
        form_title: content.contact.form_title || { es: '', en: '' },
        form_button_text: content.contact.form_button_text || { es: '', en: '' },
        map_embed: content.contact.map_embed,
      } : initialContactContent;

      const loadedFooterContent = content.footer ? {
        copyright_text: content.footer.copyright_text || { es: '', en: '' },
        privacy_policy_url: content.footer.privacy_policy_url || { es: '', en: '' },
        terms_url: content.footer.terms_url || { es: '', en: '' },
        facebook_url: content.footer.facebook_url || { es: '', en: '' },
        instagram_url: content.footer.instagram_url || { es: '', en: '' },
        twitter_url: content.footer.twitter_url || { es: '', en: '' },
      } : initialFooterContent;

      // Sync initial content ref after loading from API
      const loadedCtaContent = content.ctas && content.ctas.length > 0 ? {
        title: content.ctas[0].title || { es: '', en: '' },
        description: content.ctas[0].description || { es: '', en: '' },
        button_text: content.ctas[0].button_text || { es: '', en: '' },
        button_url: content.ctas[0].button_url || { es: '', en: '' },
        background_color: content.ctas[0].background_color || '#4ECDC4',
      } : initialCTAContent;

      initialContentRef.current = {
        heroContent: JSON.stringify(loadedHeroContent),
        navbarContent: JSON.stringify(loadedNavbarContent),
        queesContent: JSON.stringify(loadedQueEsContent),
        whoweareContent: JSON.stringify(loadedWhoWeAreContent),
        galleryContent: JSON.stringify(loadedGalleryContent),
        contactContent: JSON.stringify(loadedContactContent),
        footerContent: JSON.stringify(loadedFooterContent),
        ctaContent: JSON.stringify(loadedCtaContent),
        teamMembers: JSON.stringify(loadedTeamMembers),
        galleryImages: JSON.stringify(loadedGalleryImages),
      };
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Error al cargar el contenido');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContentFromAPI();
  }, [loadContentFromAPI]);

  // Refs for tracking initial content
  const initialContentRef = useRef({
    heroContent: '',
    navbarContent: '',
    queesContent: '',
    whoweareContent: '',
    galleryContent: '',
    contactContent: '',
    footerContent: '',
    ctaContent: '',
    teamMembers: '',
    galleryImages: '',
  });

  // Ref to prevent concurrent saves
  const savingRef = useRef(false);

  // Track changes
  useEffect(() => {
    const hasChanges = 
      JSON.stringify(heroContent) !== initialContentRef.current.heroContent ||
      JSON.stringify(navbarContent) !== initialContentRef.current.navbarContent ||
      JSON.stringify(queesContent) !== initialContentRef.current.queesContent ||
      JSON.stringify(whoweareContent) !== initialContentRef.current.whoweareContent ||
      JSON.stringify(galleryContent) !== initialContentRef.current.galleryContent ||
      JSON.stringify(contactContent) !== initialContentRef.current.contactContent ||
      JSON.stringify(footerContent) !== initialContentRef.current.footerContent ||
      JSON.stringify(ctaContent) !== initialContentRef.current.ctaContent ||
      JSON.stringify(teamMembers) !== initialContentRef.current.teamMembers ||
      JSON.stringify(galleryImages) !== initialContentRef.current.galleryImages;
    
    setHasUnsavedChanges(hasChanges);
  }, [heroContent, navbarContent, queesContent, whoweareContent, galleryContent, contactContent, footerContent, ctaContent, teamMembers, galleryImages]);

  // Check for tour on mount
  // Update preview URL when section changes
  useEffect(() => {
    setPreviewUrl(`${window.location.origin}/preview?section=${selectedSection}`);
  }, [selectedSection]);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("site-builder-tour-completed");
    if (!hasSeenTour) {
      setShowTour(true);
    }
    setPreviewUrl(`${window.location.origin}/preview?section=${selectedSection}`);
  }, [selectedSection]);

  // Unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleLogout = async () => {
    if (hasUnsavedChanges) {
      const confirm = window.confirm('Tienes cambios sin guardar. ¿Estás seguro de que quieres cerrar sesión?');
      if (!confirm) return;
    }
    await logoutUser();
    navigate("/");
  };

  const addTeamMember = async (memberData: Partial<CMSTeamMember>) => {
    try {
      const newMember = await cmsService.createTeamMember(memberData);
      setTeamMembers(prev => [...prev, newMember]);
      toast.success('Miembro agregado correctamente');
    } catch (error) {
      console.error('Error adding team member:', error);
      toast.error('Error al agregar miembro');
    }
  };

  const updateTeamMember = async (id: number, memberData: Partial<CMSTeamMember>) => {
    try {
      const updatedMember = await cmsService.updateTeamMember(id, memberData);
      setTeamMembers(prev => prev.map(m => m.id === id ? updatedMember : m));
      toast.success('Miembro actualizado correctamente');
    } catch (error) {
      console.error('Error updating team member:', error);
      toast.error('Error al actualizar miembro');
    }
  };

  const deleteTeamMember = async (id: number) => {
    try {
      await cmsService.deleteTeamMember(id);
      setTeamMembers(prev => prev.filter(m => m.id !== id));
      toast.success('Miembro eliminado correctamente');
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast.error('Error al eliminar miembro');
    }
  };

  const loadGalleryImages = async () => {
    try {
      const images = await cmsService.getGalleryImages();
      setGalleryImages(images);
    } catch (error) {
      console.error('Error loading gallery images:', error);
      toast.error('Error al cargar imágenes de galería');
    }
  };

  const addGalleryImage = async (imageData: Partial<CMSGalleryImage>) => {
    try {
      const data = { ...imageData, section: 1 };
      const newImage = await cmsService.createGalleryImage(data);
      setGalleryImages(prev => [...prev, newImage]);
      toast.success('Imagen agregada correctamente');
    } catch (error) {
      console.error('Error adding gallery image:', error);
      toast.error('Error al agregar imagen');
    }
  };

  const updateGalleryImage = async (id: number, imageData: Partial<CMSGalleryImage>) => {
    try {
      const updatedImage = await cmsService.updateGalleryImage(id, imageData);
      setGalleryImages(prev => prev.map(img => img.id === id ? updatedImage : img));
      toast.success('Imagen actualizada correctamente');
    } catch (error) {
      console.error('Error updating gallery image:', error);
      toast.error('Error al actualizar imagen');
    }
  };

  const deleteGalleryImage = async (id: number) => {
    try {
      await cmsService.deleteGalleryImage(id);
      setGalleryImages(prev => prev.filter(img => img.id !== id));
      toast.success('Imagen eliminada correctamente');
    } catch (error) {
      console.error('Error deleting gallery image:', error);
      toast.error('Error al eliminar imagen');
    }
  };

  const reorderGalleryImages = async (newOrder: CMSGalleryImage[]) => {
    const previousOrder = galleryImages;
    setGalleryImages(newOrder);
    try {
      await Promise.all(newOrder.map((image, index) =>
        cmsService.updateGalleryImage(image.id!, { ...image, order: index })
      ));
      toast.success('Orden de imágenes actualizado correctamente');
    } catch (error) {
      console.error('Error updating image order:', error);
      setGalleryImages(previousOrder);
      toast.error('Error al actualizar el orden');
    }
  };

  const reorderTeamMembers = async (newOrder: CMSTeamMember[]) => {
    const previousOrder = teamMembers;
    // Optimistic update
    setTeamMembers(newOrder);
    try {
      // Update order for each member
      await Promise.all(newOrder.map((member, index) => 
        cmsService.updateTeamMember(member.id!, { ...member, order: index })
      ));
      toast.success('Orden actualizado correctamente');
    } catch (error) {
      console.error('Error updating order:', error);
      // Revert on error
      setTeamMembers(previousOrder);
      toast.error('Error al actualizar el orden');
    }
  };

  const handlePublish = useCallback(async () => {
    if (savingRef.current) {
      return;
    }
    savingRef.current = true;
    setIsSaving(true);
    
    try {
      await Promise.all([
        cmsService.updateNavbar({
          logo: navbarContent.logo,
          logo_text: navbarContent.logo_text,
          cta_text: navbarContent.cta_text,
          cta_link: navbarContent.cta_link,
        }),
        cmsService.updateHero({
          variant: heroContent.variant,
          title: heroContent.title,
          card1_title: heroContent.card1_title,
          card1_description: heroContent.card1_description,
          card1_button_text: heroContent.card1_button_text,
          card1_image: heroContent.card1_image,
          card1_video: heroContent.card1_video,
          card1_color: heroContent.card1_color,
          card1_url: heroContent.card1_url,
          card2_title: heroContent.card2_title,
          card2_description: heroContent.card2_description,
          card2_button_text: heroContent.card2_button_text,
          card2_image: heroContent.card2_image,
          card2_color: heroContent.card2_color,
          card2_url: heroContent.card2_url,
          card3_title: heroContent.card3_title,
          card3_description: heroContent.card3_description,
          card3_button_text: heroContent.card3_button_text,
          card3_image: heroContent.card3_image,
          card3_color: heroContent.card3_color,
          card3_url: heroContent.card3_url,
          video_background: heroContent.video_background,
          video_overlay_text: heroContent.video_overlay_text,
          centered_cta_text: heroContent.centered_cta_text,
          centered_cta_url: heroContent.centered_cta_url,
          split_image: heroContent.split_image,
          split_image_position: heroContent.split_image_position,
        }),
        cmsService.updateQueEs({
          title: queesContent.title,
          card1_title: queesContent.card1_title,
          card1_description: queesContent.card1_description,
          card1_button_text: queesContent.card1_button_text,
          card1_image: queesContent.card1_image,
          card1_color: queesContent.card1_color,
          card2_title: queesContent.card2_title,
          card2_description: queesContent.card2_description,
          card2_button_text: queesContent.card2_button_text,
          card2_image: queesContent.card2_image,
          card2_color: queesContent.card2_color,
          card3_title: queesContent.card3_title,
          card3_description: queesContent.card3_description,
          card3_button_text: queesContent.card3_button_text,
          card3_image: queesContent.card3_image,
          card3_color: queesContent.card3_color,
        }),
        cmsService.updateWhoWeAre({
          title: whoweareContent.title,
          content: whoweareContent.content,
          image: whoweareContent.image,
        }),
        cmsService.updateGallery({
          title: galleryContent.title,
        }),
        cmsService.updateContact({
          title: contactContent.title,
          subtitle: contactContent.subtitle,
          email_label: contactContent.email_label,
          phone_label: contactContent.phone_label,
          address_label: contactContent.address_label,
          form_title: contactContent.form_title,
          form_button_text: contactContent.form_button_text,
          map_embed: contactContent.map_embed,
        }),
        cmsService.updateFooter({
          copyright_text: footerContent.copyright_text,
          privacy_policy_url: footerContent.privacy_policy_url,
          terms_url: footerContent.terms_url,
          facebook_url: footerContent.facebook_url,
          instagram_url: footerContent.instagram_url,
          twitter_url: footerContent.twitter_url,
        }),
        // Update CTA section if enabled
        sections.find(s => s.key === 'cta')?.enabled ? 
          cmsService.updateCTA({
            title: ctaContent.title,
            description: ctaContent.description,
            button_text: ctaContent.button_text,
            button_url: ctaContent.button_url,
            background_color: ctaContent.background_color,
          }, ctaContent.id) : Promise.resolve(),
        cmsService.updateConfig({
          navbar_enabled: sections.find(s => s.key === 'navbar')?.enabled ?? true,
          hero_enabled: sections.find(s => s.key === 'hero')?.enabled ?? true,
          quees_enabled: sections.find(s => s.key === 'quees')?.enabled ?? true,
          whoweare_enabled: sections.find(s => s.key === 'whoweare')?.enabled ?? true,
          gallery_enabled: sections.find(s => s.key === 'gallery')?.enabled ?? true,
          contact_enabled: sections.find(s => s.key === 'contact')?.enabled ?? true,
          footer_enabled: sections.find(s => s.key === 'footer')?.enabled ?? true,
          cta_sections: sections.find(s => s.key === 'cta')?.enabled ? [1] : [],
          section_order: sections.sort((a, b) => a.order - b.order).map(s => s.key),
        }),
      ]);
      
      setHasUnsavedChanges(false);
      setPreviewKey(k => k + 1);
      
      initialContentRef.current = {
        heroContent: JSON.stringify(heroContent),
        navbarContent: JSON.stringify(navbarContent),
        queesContent: JSON.stringify(queesContent),
        whoweareContent: JSON.stringify(whoweareContent),
        galleryContent: JSON.stringify(galleryContent),
        contactContent: JSON.stringify(contactContent),
        footerContent: JSON.stringify(footerContent),
        ctaContent: JSON.stringify(ctaContent),
        teamMembers: JSON.stringify(teamMembers),
        galleryImages: JSON.stringify(galleryImages),
      };
      
      toast.success('¡Publicado!', {
        description: 'Tu sitio ahora está vivo para todos los visitantes',
        duration: 5000,
      });
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Error al guardar', {
        description: 'Verifica tu conexión e intenta de nuevo',
        duration: 5000,
      });
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  }, [heroContent, navbarContent, queesContent, whoweareContent, galleryContent, contactContent, footerContent, ctaContent, sections, teamMembers, galleryImages]);

  const currentSection = SECTIONS.find(s => s.key === selectedSection);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {showTour && (
        <WelcomeTour 
          onComplete={() => setShowTour(false)} 
          onSkip={() => setShowTour(false)} 
        />
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between px-3 md:px-4 h-14">
          <div className="flex items-center gap-2 md:gap-4">
            <Link 
              to="/inicio" 
              className="flex items-center gap-1.5 md:gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              onClick={(e) => {
                if (hasUnsavedChanges) {
                  e.preventDefault();
                  const confirm = window.confirm('Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?');
                  if (confirm) {
                    navigate('/inicio');
                  }
                }
              }}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="text-sm hidden sm:inline">Volver</span>
            </Link>
            <div className="h-6 w-px bg-gray-300 hidden sm:block" />
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-gray-900 hidden md:inline">Editor del Sitio</span>
              {hasUnsavedChanges && (
                <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  <AlertTriangle className="w-3 h-3" />
                  <span className="hidden sm:inline">Sin guardar</span>
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
            {/* Auto-save indicator */}
            <div className="hidden lg:flex items-center gap-2 text-xs text-gray-500 mr-2">
            </div>
            
            {/* Preview Toggle */}
            <Button
              variant={isPreviewMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={isPreviewMode ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {isPreviewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="ml-1.5 hidden md:inline">{isPreviewMode ? "Editar" : "Vista Previa"}</span>
            </Button>
            
            {/* Publish */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePublish()}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              <span className="ml-1.5 hidden md:inline">{isSaving ? "Publicando..." : "Publicar"}</span>
            </Button>
          </div>
        </div>
        
        {/* Mobile Section Tabs - Horizontal Scroll */}
        <div className="sm:hidden flex overflow-x-auto border-t border-gray-200 px-2 py-2 gap-1 scrollbar-hide">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.key}
                onClick={() => setSelectedSection(section.key)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
                  selectedSection === section.key
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{section.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Desktop */}
        <aside 
          className={`hidden sm:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
            sidebarOpen ? "w-64" : "w-14"
          }`}
          id="sidebar"
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 flex justify-center border-b border-gray-100"
            title={sidebarOpen ? "Contraer menú" : "Expandir menú"}
          >
            {sidebarOpen ? <ChevronLeft className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
          </button>
          
          {sidebarOpen && (
            <nav className="flex-1 overflow-y-auto p-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">
                Secciones
              </p>
              {SECTIONS.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.key}
                    onClick={() => setSelectedSection(section.key)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all group ${
                        selectedSection === section.key
                          ? "bg-green-100 text-green-800"
                          : "text-gray-600 hover:bg-gray-100"
                    }`}
                    title={section.description}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${selectedSection === section.key ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{section.label}</div>
                      <div className="text-xs text-gray-400 truncate">{section.description}</div>
                    </div>
                  </button>
                );
              })}
            </nav>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-3 md:p-6 pb-20 sm:pb-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                <p className="text-gray-500">Cargando contenido...</p>
              </div>
            </div>
          ) : isPreviewMode ? (
            <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Vista Previa en Vivo</h2>
                  <p className="text-sm text-gray-500">Así se verá tu sitio públicamente</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(previewUrl || '/', '_blank')}
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Abrir en nueva pestaña
                </Button>
              </div>
              <div className="flex-1 bg-gray-100 p-4">
                <div className="h-full rounded-lg overflow-hidden border-2 border-gray-200 bg-white">
                  <iframe
                    key={previewKey}
                    src={previewUrl || '/'}
                    className="w-full h-full min-h-[600px]"
                    title="Vista previa del sitio"
                    sandbox="allow-same-origin allow-scripts allow-forms"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              {/* Section Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  {currentSection && React.createElement(currentSection.icon, { 
                    className: "w-6 h-6 text-green-600" 
                  })}
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    {currentSection?.label}
                  </h2>
                </div>
                <p className="text-gray-500">
                  {currentSection?.description}
                </p>
              </div>
              
              {/* Editor */}
              <div id="editor">
                {selectedSection === 'hero' ? (
                  <HeroEditor 
                    content={heroContent} 
                    onChange={setHeroContent}
                    onSave={() => handlePublish()}
                    isSaving={isSaving}
                  />
                ) : selectedSection === 'navbar' ? (
                  <NavbarEditor
                    content={navbarContent}
                    onChange={setNavbarContent}
                    onSave={() => handlePublish()}
                    isSaving={isSaving}
                  />
                ) : selectedSection === 'quees' ? (
                  <QueEsEditor
                    content={queesContent}
                    onChange={setQueesContent}
                    onSave={() => handlePublish()}
                    isSaving={isSaving}
                  />
                ) : selectedSection === 'whoweare' ? (
                  <WhoWeAreEditor
                    content={whoweareContent}
                    onChange={setWhoWeAreContent}
                    onSave={() => handlePublish()}
                    isSaving={isSaving}
                    teamMembers={teamMembers}
                    onAddTeamMember={addTeamMember}
                    onUpdateTeamMember={updateTeamMember}
                    onDeleteTeamMember={deleteTeamMember}
                    onReorderTeamMembers={reorderTeamMembers}
                  />
                ) : selectedSection === 'gallery' ? (
                  <GalleryEditor
                    content={galleryContent}
                    onChange={setGalleryContent}
                    onSave={() => handlePublish()}
                    isSaving={isSaving}
                    galleryImages={galleryImages}
                    onAddGalleryImage={addGalleryImage}
                    onUpdateGalleryImage={updateGalleryImage}
                    onDeleteGalleryImage={deleteGalleryImage}
                    onReorderGalleryImages={reorderGalleryImages}
                  />
                ) : selectedSection === 'contact' ? (
                  <ContactEditor
                    content={contactContent}
                    onChange={setContactContent}
                    onSave={() => handlePublish()}
                    isSaving={isSaving}
                  />
                ) : selectedSection === 'cta' ? (
                  <CTAEditor
                    content={ctaContent}
                    onChange={setCtaContent}
                    onSave={() => handlePublish()}
                    isSaving={isSaving}
                  />
                ) : selectedSection === 'footer' ? (
                  <FooterEditor
                    content={footerContent}
                    onChange={setFooterContent}
                    onSave={() => handlePublish()}
                    isSaving={isSaving}
                  />
                ) : selectedSection === 'sections' ? (
                  <SectionReorder
                    sections={sections}
                    onChange={setSections}
                    onSave={() => handlePublish()}
                    isSaving={isSaving}
                  />
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <p className="text-gray-500">Editor para: <strong>{currentSection?.label}</strong></p>
                    <p className="text-sm text-gray-400 mt-2">Implementación del editor en progreso</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Status Bar - Desktop */}
      <footer className="hidden sm:block bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${hasUnsavedChanges ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`}></span>
              {hasUnsavedChanges ? 'Cambios sin guardar' : 'Guardado'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" target="_blank" className="hover:text-green-600 transition-colors">
              Ver sitio en vivo →
            </Link>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Action Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-3 py-2 flex items-center justify-between z-40">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {hasUnsavedChanges ? (
            <span className="flex items-center gap-1 text-amber-600">
              <AlertTriangle className="w-3 h-3" />
              Sin guardar
            </span>
          ) : (
            <span>Publicado</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handlePublish}
            disabled={isSaving}
            className="bg-green-600 text-xs"
          >
            {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
            <span className="ml-1">Publicar</span>
          </Button>
        </div>
      </div>

      <AppFooter />
    </div>
  );
};

export default SiteBuilderPage;

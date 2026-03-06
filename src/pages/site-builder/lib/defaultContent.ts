import type { 
  NavbarContent, 
  HeroContent, 
  QueEsContent, 
  WhoWeAreContent, 
  GalleryContent, 
  ContactContent, 
  FooterContent, 
  CTAContent 
} from './types';

export const DEFAULT_NAVBAR_CONTENT: NavbarContent = Object.freeze({
  logo: '/images/landing/navbar2.png',
  logo_text: { es: 'Vía Recreativa', en: 'Vía Recreativa' },
  cta_text: { es: 'Participa', en: 'Join Us' },
  cta_link: { es: '/registro', en: '/registro' },
});

export const DEFAULT_HERO_CONTENT: HeroContent = Object.freeze({
  variant: 'cards',
  title: { es: 'Vía Recreativa Tijuana', en: 'Vía Recreativa Tijuana' },
  card1_title: { es: 'Vía Recreativa', en: 'Vía Recreativa' },
  card1_description: { es: 'Transforma los espacios públicos de tu ciudad', en: 'Transform public spaces in your city' },
  card1_button_text: { es: 'Ver más', en: 'Learn more' },
  card1_image: '/images/landing/hero1.png',
  card1_video: null,
  card1_color: '#FF6B6B',
  card1_url: { es: '/', en: '/' },
  card2_title: { es: 'Convocatoria', en: 'Call' },
  card2_description: { es: 'Únete a la próxima jornada', en: 'Join the next event' },
  card2_button_text: { es: 'Regístrate', en: 'Sign up' },
  card2_image: '/images/landing/hero2.png',
  card2_color: '#4ECDC4',
  card2_url: { es: '/registro', en: '/registro' },
  card3_title: { es: 'Registro', en: 'Registration' },
  card3_description: { es: 'Participa en nuestras actividades', en: 'Participate in our activities' },
  card3_button_text: { es: 'Inscríbete', en: 'Register' },
  card3_image: '/images/landing/hero3.png',
  card3_color: '#FFCC5C',
  card3_url: { es: '/registro', en: '/registro' },
  video_background: null,
  video_overlay_text: { es: '', en: '' },
  centered_cta_text: { es: 'Únete ahora', en: 'Join now' },
  centered_cta_url: { es: '/registro', en: '/registro' },
  split_image: null,
  split_image_position: 'right',
});

export const DEFAULT_QUEES_CONTENT: QueEsContent = Object.freeze({
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
});

export const DEFAULT_WHOWEARE_CONTENT: WhoWeAreContent = Object.freeze({
  title: { es: '¿Quiénes Somos?', en: 'About Us' },
  content: { es: 'Somos una organización dedicada a transformar los espacios públicos de Tijuana para crear oportunidades de juego y crecimiento para la infancia.', en: 'We are an organization dedicated to transforming public spaces in Tijuana to create opportunities for play and growth for children.' },
  image: '/images/landing/whoweare.png',
});

export const DEFAULT_GALLERY_CONTENT: GalleryContent = Object.freeze({
  title: { es: 'Galería', en: 'Gallery' },
});

export const DEFAULT_CONTACT_CONTENT: ContactContent = Object.freeze({
  title: { es: 'Contáctanos', en: 'Contact Us' },
  subtitle: { es: 'Estamos aquí para responder tus preguntas y escuchar tus ideas.', en: 'We are here to answer your questions and listen to your ideas.' },
  email_label: { es: 'Email', en: 'Email' },
  phone_label: { es: 'Teléfono', en: 'Phone' },
  address_label: { es: 'Ubicación', en: 'Location' },
  form_title: { es: 'Envíanos un mensaje', en: 'Send us a message' },
  form_button_text: { es: 'Enviar Mensaje', en: 'Send Message' },
  map_embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d107708.09148592196!2d-117.0886642!3d32.47595855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80d94a5e62f4acdb%3A0x3b23ad35551e860a!2sPlayas%20De%20Tijuana%2C%20B.C.!5e0!3m2!1ses!2smx!4v1750959707546!5m2!1ses!2smx',
});

export const DEFAULT_FOOTER_CONTENT: FooterContent = Object.freeze({
  copyright_text: { es: '© 2026 Tijuanita Mi Ciudad. Todos los derechos reservados.', en: '© 2026 Tijuanita Mi Ciudad. All rights reserved.' },
  privacy_policy_url: { es: '/privacidad', en: '/privacy' },
  terms_url: { es: '/terminos', en: '/terms' },
  facebook_url: { es: 'https://facebook.com/tijuanitamiciudad', en: 'https://facebook.com/tijuanitamiciudad' },
  instagram_url: { es: 'https://instagram.com/tijuanitamiciudad', en: 'https://instagram.com/tijuanitamiciudad' },
  twitter_url: { es: '', en: '' },
});

export const DEFAULT_CTA_CONTENT: CTAContent = Object.freeze({
  title: { es: 'Únete a nuestra comunidad', en: 'Join our community' },
  description: { es: 'Participa en Vía Recreativa y ayuda a transformar los espacios públicos de Tijuana.', en: 'Participate in Vía Recreativa and help transform public spaces in Tijuana.' },
  button_text: { es: 'Regístrate ahora', en: 'Sign up now' },
  button_url: { es: '/registro', en: '/registro' },
  background_color: '#4ECDC4',
});

export const DEFAULT_SECTIONS = Object.freeze([
  { key: 'navbar' as const, label: 'Barra de Navegación', icon: '☰', enabled: true, order: 0 },
  { key: 'hero' as const, label: 'Hero (Portada)', icon: '🎯', enabled: true, order: 1 },
  { key: 'cta' as const, label: 'Llamada a la Acción', icon: '📢', enabled: true, order: 2 },
  { key: 'quees' as const, label: '¿Qué es?', icon: '❓', enabled: true, order: 3 },
  { key: 'whoweare' as const, label: '¿Quiénes Somos?', icon: '👥', enabled: true, order: 4 },
  { key: 'gallery' as const, label: 'Galería', icon: '🖼️', enabled: true, order: 5 },
  { key: 'contact' as const, label: 'Contacto', icon: '📧', enabled: true, order: 6 },
  { key: 'footer' as const, label: 'Pie de Página', icon: '📝', enabled: true, order: 7 },
]);

export const DEFAULT_SECTION_CONFIG = Object.freeze({
  navbar_enabled: true,
  hero_enabled: true,
  quees_enabled: true,
  whoweare_enabled: true,
  gallery_enabled: true,
  contact_enabled: true,
  footer_enabled: true,
  cta_sections: [],
  section_order: ['navbar', 'hero', 'cta', 'quees', 'whoweare', 'gallery', 'contact', 'footer'],
});

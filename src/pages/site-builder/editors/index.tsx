import { lazy, Suspense } from 'react';
import type { 
  NavbarContent, 
  HeroContent, 
  QueEsContent, 
  WhoWeAreContent, 
  GalleryContent, 
  ContactContent, 
  FooterContent, 
  CTAContent,
  NavbarEditorProps,
  HeroEditorProps,
  QueEsEditorProps,
  WhoWeAreEditorProps,
  GalleryEditorProps,
  ContactEditorProps,
  FooterEditorProps,
  CTAEditorProps
} from './types';

export const NavbarEditor = lazy(() => import('./NavbarEditor'));
export const HeroEditor = lazy(() => import('./HeroEditor'));
export const QueEsEditor = lazy(() => import('./QueEsEditor'));
export const WhoWeAreEditor = lazy(() => import('./WhoWeAreEditor'));
export const GalleryEditor = lazy(() => import('./GalleryEditor'));
export const ContactEditor = lazy(() => import('./ContactEditor'));
export const FooterEditor = lazy(() => import('./FooterEditor'));
export const CTAEditor = lazy(() => import('./CTAEditor'));

export type {
  NavbarContent,
  HeroContent,
  QueEsContent,
  WhoWeAreContent,
  GalleryContent,
  ContactContent,
  FooterContent,
  CTAContent,
  NavbarEditorProps,
  HeroEditorProps,
  QueEsEditorProps,
  WhoWeAreEditorProps,
  GalleryEditorProps,
  ContactEditorProps,
  FooterEditorProps,
  CTAEditorProps
};

export type EditorComponent<T> = React.FC<T>;

export interface EditorConfig {
  name: string;
  lazyComponent: ReturnType<typeof lazy>;
}

export const EDITORS: Record<string, EditorConfig> = {
  navbar: { name: 'NavbarEditor', lazyComponent: NavbarEditor },
  hero: { name: 'HeroEditor', lazyComponent: HeroEditor },
  quees: { name: 'QueEsEditor', lazyComponent: QueEsEditor },
  whoweare: { name: 'WhoWeAreEditor', lazyComponent: WhoWeAreEditor },
  gallery: { name: 'GalleryEditor', lazyComponent: GalleryEditor },
  contact: { name: 'ContactEditor', lazyComponent: ContactEditor },
  footer: { name: 'FooterEditor', lazyComponent: FooterEditor },
  cta: { name: 'CTAEditor', lazyComponent: CTAEditor },
};

export const EditorLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
    </div>
  }>
    {children}
  </Suspense>
);

import React from 'react';
import type { 
  NavbarContent as NavbarContentType,
  NavbarEditorProps 
} from '../editors/NavbarEditor';
import type { 
  HeroContent as HeroContentType,
  HeroEditorProps 
} from '../editors/HeroEditor';
import type { 
  QueEsContent as QueEsContentType,
  QueEsEditorProps 
} from '../editors/QueEsEditor';
import type { 
  WhoWeAreContent as WhoWeAreContentType,
  WhoWeAreEditorProps 
} from '../editors/WhoWeAreEditor';
import type { 
  GalleryContent as GalleryContentType,
  GalleryEditorProps 
} from '../editors/GalleryEditor';
import type { 
  ContactContent as ContactContentType,
  ContactEditorProps 
} from '../editors/ContactEditor';
import type { 
  FooterContent as FooterContentType,
  FooterEditorProps 
} from '../editors/FooterEditor';
import type { 
  CTAContent as CTAContentType,
  CTAEditorProps 
} from '../editors/CTAEditor';

export type NavbarContent = NavbarContentType;
export type HeroContent = HeroContentType;
export type QueEsContent = QueEsContentType;
export type WhoWeAreContent = WhoWeAreContentType;
export type GalleryContent = GalleryContentType;
export type ContactContent = ContactContentType;
export type FooterContent = FooterContentType;
export type CTAContent = CTAContentType;

export type NavbarEditorProps = NavbarEditorProps;
export type HeroEditorProps = HeroEditorProps;
export type QueEsEditorProps = QueEsEditorProps;
export type WhoWeAreEditorProps = WhoWeAreEditorProps;
export type GalleryEditorProps = GalleryEditorProps;
export type ContactEditorProps = ContactEditorProps;
export type FooterEditorProps = FooterEditorProps;
export type CTAEditorProps = CTAEditorProps;

export type SectionKey = 'sections' | 'navbar' | 'hero' | 'cta' | 'quees' | 'whoweare' | 'gallery' | 'contact' | 'footer';

export interface Section {
  key: SectionKey;
  label: string;
  icon: React.ElementType;
  enabled: boolean;
  order: number;
}

export interface InitialContentRef {
  heroContent: string;
  navbarContent: string;
  queesContent: string;
  whoweareContent: string;
  galleryContent: string;
  contactContent: string;
  footerContent: string;
  ctaContent: string;
}

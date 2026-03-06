import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import QueEs from "./sections/QueEs";
import WhoWeAre from "./sections/WhoWeAre";
import Gallery from "./sections/Gallery";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import { cmsService, type CMSLandingPageContent, type CMSNavbar, type CMSHero, type CMSQueEs, type CMSWhoWeAre, type CMSGallery, type CMSContact, type CMSFooter, type CMSCTA } from "@/services/cmsService";

const defaultContent: CMSLandingPageContent = {
  config: null,
  navbar: null,
  hero: null,
  quees: null,
  whoweare: null,
  gallery: null,
  contact: null,
  footer: null,
  ctas: [],
};

interface SingleSectionContent {
  navbar?: CMSNavbar | null;
  hero?: CMSHero | null;
  quees?: CMSQueEs | null;
  whoweare?: CMSWhoWeAre | null;
  gallery?: CMSGallery | null;
  contact?: CMSContact | null;
  footer?: CMSFooter | null;
  cta?: CMSCTA | null;
}

const PreviewPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section");
  
  const [content, setContent] = useState<CMSLandingPageContent>(defaultContent);
  const [singleSectionContent, setSingleSectionContent] = useState<SingleSectionContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isSingleSection = section && section !== "sections" && section !== "config";

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        
        if (isSingleSection) {
          // Fetch single section preview
          const sectionData = await cmsService.getSingleSectionPreview(section);
          if (sectionData) {
            setSingleSectionContent(sectionData as SingleSectionContent);
          }
        } else {
          // Fetch full preview
          const data = await cmsService.getPreviewContent();
          setContent(data);
        }
        setError(null);
      } catch (err) {
        console.error("Failed to fetch CMS preview content:", err);
        setError("Using default content");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [section, isSingleSection]);

  if (loading) {
    return (
      <main className="bg-blancoHuesoFondo z-10 relative min-h-screen w-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-moradoSecundario border-t-transparent rounded-full animate-spin" />
          <p className="text-blackOlive/60">Cargando vista previa...</p>
        </div>
      </main>
    );
  }

  // Single section preview
  if (isSingleSection) {
    const sectionContent = singleSectionContent || {};
    
    return (
      <main className="bg-blancoHuesoFondo z-10 relative min-h-screen w-screen">
        {section === "navbar" && <Navbar content={sectionContent.navbar} />}
        {section === "hero" && <Hero content={sectionContent.hero} />}
        {section === "quees" && <QueEs content={sectionContent.quees} />}
        {section === "whoweare" && <WhoWeAre content={sectionContent.whoweare} />}
        {section === "gallery" && <Gallery content={sectionContent.gallery} />}
        {section === "contact" && <Contact content={sectionContent.contact} />}
        {section === "footer" && <Footer content={sectionContent.footer} />}
        {section === "cta" && sectionContent.cta && (
          <section className="py-16 px-4" style={{ backgroundColor: sectionContent.cta.background_color || '#4ECDC4' }}>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-4">{sectionContent.cta.title?.es || sectionContent.cta.title?.en}</h2>
              <p className="text-white/90 mb-6">{sectionContent.cta.description?.es || sectionContent.cta.description?.en}</p>
              <a
                href={sectionContent.cta.button_url?.es || sectionContent.cta.button_url?.en || '#'}
                className="inline-block bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                {sectionContent.cta.button_text?.es || sectionContent.cta.button_text?.en}
              </a>
            </div>
          </section>
        )}
      </main>
    );
  }

  // Full site preview
  return (
    <main className="bg-blancoHuesoFondo z-10 relative min-h-screen w-screen">
      <Navbar content={content.navbar} />
      <Hero content={content.hero} />
      <QueEs content={content.quees} />
      <WhoWeAre content={content.whoweare} />
      <Gallery content={content.gallery} />
      <Contact content={content.contact} />
      <Footer content={content.footer} />
    </main>
  );
};

export default PreviewPage;

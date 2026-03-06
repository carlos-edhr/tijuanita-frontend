import { useState, useEffect } from "react";
import { Facebook, Instagram, Menu, X } from "lucide-react";
import type { CMSNavbar } from "@/services/cmsService";
import { useLanguage } from "@/context/LanguageProvider";
import LanguageSwitcher from "@/components/ui/language-switcher";
import { SOCIAL_LINKS } from "@/constants/social";

interface NavbarProps {
  content: CMSNavbar | null;
}

const DEFAULT_NAV_LINKS = [
  { name: { es: "¿Qué es?", en: "What is it?" }, link: "#quees" },
  { name: { es: "¿Quiénes somos?", en: "About us" }, link: "#whoweare" },
  { name: { es: "Galería", en: "Gallery" }, link: "#galeria" },
  { name: { es: "Contáctanos", en: "Contact us" }, link: "#contacto" },
];

const Navbar: React.FC<NavbarProps> = ({ content }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { language, getLocalizedValue } = useLanguage();

  const navLinks = DEFAULT_NAV_LINKS;
  const logoUrl = content?.logo || '/images/landing/navbar2.png';
  const logoText = getLocalizedValue(content?.logo_text) || 'Tijuanita Mi Ciudad';
  const ctaText = getLocalizedValue(content?.cta_text) || '';
  const ctaLink = getLocalizedValue(content?.cta_link) || '';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="#hero" className="flex items-center gap-2 z-10">
            <div className="relative w-40 h-16">
              <img
                src={logoUrl}
                alt={logoText}
                className="object-contain w-full h-full"
              />
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.link}
                  href={link.link}
                  className="text-blackOlive hover:text-moradoSecundario transition-colors text-md font-medium relative group"
                >
                  {getLocalizedValue(link.name)}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-moradoSecundario transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4 ml-4">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blackOlive hover:text-moradoSecundario transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blackOlive hover:text-moradoSecundario transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-6 w-6" />
              </a>
            </div>

            <LanguageSwitcher className="ml-4" />

            <a
              href={ctaLink}
              className="ml-2 px-6 py-2 rounded-full bg-gradient-to-r from-moradoSecundario to-[#0a33ff] text-white text-sm font-bold hover:opacity-90 transition-opacity"
            >
              {ctaText}
            </a>
          </div>

          <div className="lg:hidden flex items-center gap-4 z-10">
            <LanguageSwitcher />
            <div className="flex items-center gap-3 mr-2">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blackOlive hover:text-moradoSecundario transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blackOlive hover:text-moradoSecundario transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-blackOlive hover:text-moradoSecundario focus:outline-none"
              aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden inset-0 w-full h-full bg-white z-99">
          <div className="container mx-auto px-4 pt-24 pb-12">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-4 p-2 rounded-md text-blackOlive hover:text-moradoSecundario focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="flex flex-col items-center justify-start min-h-full">
              <div className="w-full max-w-md space-y-6">
                {navLinks.map((link) => (
                  <a
                    key={link.link}
                    href={link.link}
                    className="block px-6 py-4 text-blackOlive hover:text-white hover:bg-moradoSecundario/90 rounded-xl transition-all duration-300 text-center text-lg font-medium border border-moradoSecundario/30"
                    onClick={() => setIsOpen(false)}
                  >
                    {getLocalizedValue(link.name)}
                  </a>
                ))}

                <a
                  href="/voluntarios"
                  className="block px-6 py-4 rounded-xl bg-gradient-to-r from-moradoSecundario to-[#0a33ff] text-white text-center text-lg font-bold"
                  onClick={() => setIsOpen(false)}
                >
                  ¡Súmate!
                </a>
              </div>

              <div className="mt-16 flex justify-center gap-6">
                <a
                  href="https://www.instagram.com/tijuanita_mi_ciudad/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-moradoSecundario hover:text-[#0a33ff] transition-colors"
                >
                  <Instagram className="h-8 w-8" />
                </a>
                <a
                  href="https://www.facebook.com/people/Tijuanita-Mi-Ciudad/61574985633708/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-moradoSecundario hover:text-[#0a33ff] transition-colors"
                >
                  <Facebook className="h-8 w-8" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Facebook, Instagram, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import type { CMSFooter } from "@/services/cmsService";
import { useLanguage } from "@/context/LanguageProvider";
import { SOCIAL_LINKS } from "@/constants/social";

interface FooterProps {
  content: CMSFooter | null;
}

const Footer: React.FC<FooterProps> = ({ content }) => {
  const { language, getLocalizedValue } = useLanguage();
  const copyrightText = getLocalizedValue(content?.copyright_text);
  const privacyUrl = getLocalizedValue(content?.privacy_policy_url);
  const termsUrl = getLocalizedValue(content?.terms_url);
  const facebookUrl = getLocalizedValue(content?.facebook_url);
  const instagramUrl = getLocalizedValue(content?.instagram_url);
  const twitterUrl = getLocalizedValue(content?.twitter_url);
  
  return (
    <footer className="z-40 relative overflow-hidden bg-gradient-to-br from-[#FDE047] to-[#F59E0B] pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-7xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          <motion.div
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="font-kawaiiRT text-2xl text-gray-900">
              Transformando Espacios
            </h3>
            <p className="text-gray-800">
              Creando oportunidades de juego y crecimiento para la infancia en
              Tijuana
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h4 className="font-kawaiiRT text-xl text-gray-900">
              Contacto
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-800">
                <Mail className="h-5 w-5" />
                <span>{SOCIAL_LINKS.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-800">
                <MapPin className="h-5 w-5" />
                <span>Centro Comunitario, Tijuana</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <h4 className="font-kawaiiRT text-xl text-gray-900">
              Síguenos
            </h4>
            <div className="flex gap-4">
              <Link to={SOCIAL_LINKS.instagram}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-gray-900/10 hover:bg-gray-900/20"
                  aria-label="Instagram"
                >
                  <Instagram className="h-6 w-6 text-gray-900" />
                </Button>
              </Link>
              <Link to={SOCIAL_LINKS.facebook}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-gray-900/10 hover:bg-gray-900/20"
                  aria-label="Facebook"
                >
                  <Facebook className="h-6 w-6 text-gray-900" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-4"
          >
            <h4 className="font-kawaiiRT text-xl text-gray-900">Legal</h4>
            <nav className="flex flex-col space-y-2">
              <Link
                to="/privacidad"
                className="text-gray-800 hover:text-gray-900 transition-colors"
              >
                Política de Privacidad
              </Link>
              <Link
                to="/terminos"
                className="text-gray-800 hover:text-gray-900 transition-colors"
              >
                Términos de Servicio
              </Link>
              <Link
                to="/transparencia"
                className="text-gray-800 hover:text-gray-900 transition-colors"
              >
                Información Transparente
              </Link>
            </nav>
          </motion.div>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          className="my-8 h-px bg-gray-900/20"
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center text-gray-800"
        >
          <p className="mb-4">
            {copyrightText || `© ${new Date().getFullYear()} Tijuanita Mi Ciudad. Todos los derechos reservados.`}
          </p>
          <motion.a
            href="https://www.bitspirals.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-gray-700">Developed by</span>
            <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent font-bold text-lg tracking-wide group-hover:from-violet-500 group-hover:via-indigo-500 group-hover:to-purple-500 transition-all duration-300">
              Bitspirals
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.a>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;

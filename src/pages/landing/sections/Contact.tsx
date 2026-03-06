import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Mail, Send, CheckCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { CMSContact } from "@/services/cmsService";
import { useLanguage } from "@/context/LanguageProvider";
import { API_BASE_URL } from "@/config";
import { SOCIAL_LINKS, MAP_EMBED_URL } from "@/constants/social";

interface ContactProps {
  content: CMSContact | null;
}

interface FormState {
  name: string;
  email: string;
  message: string;
}

const Contact: React.FC<ContactProps> = ({ content }) => {
  const { language, getLocalizedValue } = useLanguage();
  const title = getLocalizedValue(content?.title);
  const subtitle = getLocalizedValue(content?.subtitle);
  const formTitle = getLocalizedValue(content?.form_title);
  const formButtonText = getLocalizedValue(content?.form_button_text);
  const emailLabel = getLocalizedValue(content?.email_label);
  const phoneLabel = getLocalizedValue(content?.phone_label);
  const addressLabel = getLocalizedValue(content?.address_label);
  const mapEmbed = content?.map_embed || MAP_EMBED_URL;
  
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });
  const [mounted, setMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [mapLoading, setMapLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMapLoad = () => {
    setMapLoading(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/cms/contact/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit');
      }
      
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError(language === 'es' 
        ? 'Error al enviar el mensaje. Por favor intenta de nuevo.' 
        : 'Error sending message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return (
    <section
      id="contacto"
      className="py-16 px-4 md:px-8 relative overflow-hidden bg-blancoHuesoFondo"
    >
      <div className="absolute inset-0 bg-[url('/images/textures/noise.jpg')] opacity-10 mix-blend-soft-light" />

      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[10%] top-[15%] h-40 w-40 rounded-full bg-[#fde047]/20 blur-xl"
      />

      <motion.div
        animate={{
          y: [0, -40, 0],
          rotate: [0, 45, 90, 135, 180],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[15%] top-[25%] h-24 w-24 bg-[#FF6B6B]/30 blur-lg"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-kawaiiRT text-4xl text-blackOlive md:text-6xl mb-8">
            <span className="block bg-gradient-to-r from-moradoSecundario to-[#0a33ff] bg-clip-text text-transparent">
              {title}
            </span>
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mx-auto mt-6 max-w-4xl text-lg text-gray-700 md:text-xl text-justify px-4"
          >
            {subtitle}
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8 bg-white shadow-xl border border-gray-200 rounded-3xl h-full">
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FDE047]/20 to-[#f59e0b]/20">
                    <MapPin className="w-8 h-8 text-moradoSecundario" />
                  </div>
                  <div>
                    <h3 className="text-gray-800 text-xl font-bold mb-2">
                      Ubicación
                    </h3>
                    <p className="text-gray-600">
                      Delegación Playas de Tijuana
                      <br />
                      <span className="text-gray-500">Playas de Rosarito, B.C.</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FF6B6B]/20 to-[#ee5a5a]/20">
                    <Mail className="w-8 h-8 text-moradoSecundario" />
                  </div>
                  <div>
                    <h3 className="text-gray-800 text-xl font-bold mb-2">
                      Email
                    </h3>
                    <Link
                      to={`mailto:${SOCIAL_LINKS.email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-moradoSecundario hover:text-[#0a33ff] transition-colors font-medium"
                    >
                      {SOCIAL_LINKS.email}
                    </Link>
                  </div>
                </div>

                <div className="mt-8 rounded-2xl overflow-hidden border-2 border-gray-100 shadow-lg relative min-h-[280px]">
                  {mapLoading && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                      <span className="text-gray-400">Cargando mapa...</span>
                    </div>
                  )}
                  <iframe
                    src={MAP_EMBED_URL}
                    height="280"
                    width="100%"
                    loading="lazy"
                    className="border-0"
                    style={{ border: 0 }}
                    allowFullScreen
                    aria-hidden="false"
                    title="Ubicación de Vía Recreativa en Playas de Tijuana"
                    onLoad={handleMapLoad}
                  ></iframe>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-8 bg-white shadow-xl border border-gray-200 rounded-3xl h-full">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full py-12 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    ¡Mensaje Enviado!
                  </h3>
                  <p className="text-gray-600">
                    Gracias por contactarnos. Te responderemos pronto.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="text-gray-700 block mb-2 text-base font-semibold"
                    >
                      Nombre completo <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="bg-white border-gray-300 text-gray-800 placeholder-gray-400 h-14 text-base rounded-xl shadow-sm focus:ring-2 focus:ring-moradoSecundario focus:border-moradoSecundario transition-all"
                      placeholder="Ingresa tu nombre completo"
                      required
                      aria-required="true"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="text-gray-700 block mb-2 text-base font-semibold"
                    >
                      Correo electrónico <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="bg-white border-gray-300 text-gray-800 placeholder-gray-400 h-14 text-base rounded-xl shadow-sm focus:ring-2 focus:ring-moradoSecundario focus:border-moradoSecundario transition-all"
                      placeholder="tu@correo.com"
                      required
                      aria-required="true"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="text-gray-700 block mb-2 text-base font-semibold"
                    >
                      Mensaje <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      className="bg-white border-gray-300 text-gray-800 placeholder-gray-400 text-base rounded-xl shadow-sm focus:ring-2 focus:ring-moradoSecundario focus:border-moradoSecundario transition-all resize-none"
                      placeholder="¿En qué podemos ayudarte?"
                      rows={5}
                      required
                      aria-required="true"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-moradoSecundario to-[#0a33ff] text-white text-lg py-6 rounded-xl font-bold hover:opacity-90 transition-all mt-4 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center justify-center gap-2">
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />} 
                      {formButtonText}
                    </span>
                  </Button>

                  {submitError && (
                    <p className="text-center text-sm text-red-500">
                      {submitError}
                    </p>
                  )}

                  <p className="text-center text-sm text-gray-500">
                    Los campos marcados con <span className="text-red-500">*</span> son obligatorios
                  </p>
                </form>
              )}
            </Card>
          </motion.div>
        </div>
      </div>

      <motion.div
        animate={{
          y: [0, -20, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/2 bottom-8 h-32 w-32 rounded-full bg-[#4ECDC4]/20"
      />
    </section>
  );
};

export default Contact;

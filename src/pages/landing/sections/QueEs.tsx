import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import LogoCarousel from "./LogoCarousel";
import type { CMSQueEs } from "@/services/cmsService";
import { useLanguage } from "@/context/LanguageProvider";

interface QueEsProps {
  content: CMSQueEs | null;
}

interface BilingualCardData {
  title: { es: string; en: string };
  description: { es: string; en: string };
  buttonText: { es: string; en: string };
  color: string;
  delay: number;
  image: string;
}

const QueEs: React.FC<QueEsProps> = ({ content }) => {
  const { language, getLocalizedValue } = useLanguage();
  
  const title = getLocalizedValue(content?.title);
  
  const cards = [
    {
      title: getLocalizedValue(content?.card1_title),
      description: getLocalizedValue(content?.card1_description),
      buttonText: getLocalizedValue(content?.card1_button_text),
      color: content?.card1_color || '#FF6B6B',
      image: content?.card1_image || '',
      delay: 0.1,
    },
    {
      title: getLocalizedValue(content?.card2_title),
      description: getLocalizedValue(content?.card2_description),
      buttonText: getLocalizedValue(content?.card2_button_text),
      color: content?.card2_color || '#4ECDC4',
      image: content?.card2_image || '',
      delay: 0.2,
    },
    {
      title: getLocalizedValue(content?.card3_title),
      description: getLocalizedValue(content?.card3_description),
      buttonText: getLocalizedValue(content?.card3_button_text),
      color: content?.card3_color || '#FFCC5C',
      image: content?.card3_image || '',
      delay: 0.3,
    },
  ];
  
  return (
    <section
      id="quees"
      className="relative overflow-hidden bg-blancoHuesoFondo py-20 px-4 sm:px-6 lg:px-8"
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

      <motion.div
        animate={{
          x: [0, 50, 0],
          borderRadius: ["50%", "30%", "50%"],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[20%] bottom-[20%] h-32 w-32 bg-[#4ECDC4]/30 blur-xl"
      />

      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[10%] bottom-[15%] h-20 w-20 bg-[#FFCC5C]/30 blur-lg"
      />

      <motion.div
        animate={{
          y: [0, -30, 0],
          x: [0, 30, 0],
          borderRadius: ["30%", "50%", "30%"],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[15%] top-[35%] h-16 w-16 bg-[#96CEB4]/30 blur-lg"
      />

      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-kawaiiRT text-4xl text-white md:text-6xl mb-8">
            <span className="block bg-gradient-to-r from-moradoSecundario to-[#0a33ff] bg-clip-text text-transparent">
              {title}
            </span>
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mx-auto mt-6 max-w-4xl text-lg text-blackOlive md:text-xl text-justify px-4"
          >
            <em>Tijuanita, mi ciudad</em> es una iniciativa ciudadana para
            recrear las calles mediante actividades como caminatas y vías
            recreativas, espacios de convivencia horizontal, libre de consumo,
            compartiendo de manera pacífica una ciudad migrante como Tijuana en
            Baja California, México.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: card.delay }}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 },
              }}
            >
              <Card className="h-full overflow-hidden rounded-3xl border-4 border-white/20 bg-white/10 backdrop-blur-lg shadow-2xl">
                <div className="relative h-48 md:h-40 overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"
                    style={{
                      background: `linear-gradient(to top, ${card.color}30 0%, transparent 70%)`,
                    }}
                  />
                </div>

                <CardContent className="p-6 text-center relative z-10">
                  <CardTitle
                    className="mb-3 text-2xl md:text-xl font-bold"
                    style={{ color: card.color }}
                  >
                    {card.title}
                  </CardTitle>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4"
                  >
                    <Button
                      className="w-full rounded-xl py-4 text-base font-bold text-white transition-all"
                      style={{ backgroundColor: card.color }}
                    >
                      {card.buttonText}
                    </Button>
                  </motion.div>
                </CardContent>

                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 45, 0],
                  }}
                  transition={{
                    duration: 5 + index,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -right-4 -top-4 h-16 w-16 rounded-full"
                  style={{
                    backgroundColor: card.color + "20",
                    border: `3px solid ${card.color}20`,
                    zIndex: -1,
                  }}
                />
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    x: [0, 8, 0],
                    borderRadius: ["30%", "50%", "30%"],
                  }}
                  transition={{
                    duration: 4 + index,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -bottom-3 -left-3 h-12 w-12"
                  style={{
                    backgroundColor: card.color + "20",
                    border: `3px solid ${card.color}20`,
                    zIndex: -1,
                  }}
                />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          borderRadius: ["50%", "30%", "50%"],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[5%] top-[10%] h-20 w-20 bg-[#FF9999]/20 blur-lg"
      />

      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          rotate: [0, 90, 180, 270, 360],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[5%] bottom-[10%] h-24 w-24 bg-[#88D8B0]/20 blur-lg"
      />

      <motion.div
        animate={{
          y: [0, -25, 0],
          rotate: [0, 45, 90, 135, 180],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[25%] bottom-[15%] h-16 w-16 bg-[#FFEEAD]/30 blur-lg"
      />

      <LogoCarousel />
    </section>
  );
};

export default QueEs;

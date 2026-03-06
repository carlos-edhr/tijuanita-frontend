import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import type { CMSHero } from "@/services/cmsService";
import { useLanguage } from "@/context/LanguageProvider";
import { buildCardData, type CardData } from "@/lib/landingCards";

interface HeroProps {
  content: CMSHero | null;
}

const Hero: React.FC<HeroProps> = ({ content }) => {
  const { language, getLocalizedValue } = useLanguage();
  const [videoError, setVideoError] = useState(false);
  
  useEffect(() => {
    const preloadImages = [
      '/images/landing/hero-2.png',
      '/images/landing/hero-3.png',
    ];
    preloadImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);
  
  const title = getLocalizedValue(content?.title);
  
  const cards = buildCardData(content, [], language, getLocalizedValue);
  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-blancoHuesoFondo px-4 pt-20 md:px-8">
      <div className="absolute inset-0 bg-[url('/images/textures/noise.jpg')] opacity-10 mix-blend-soft-light" />

      <div className="mx-auto max-w-7xl py-12 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <motion.h1 className="font-kawaiiRT mb-6">
            <div className="md:inline-block">
              <h1 className="md:tracking-widest cursor-default text-4xl sm:text-5xl md:text-7xl lg:text-7xl block bg-gradient-to-r from-moradoSecundario to-[#0a33ff] bg-clip-text text-transparent">
                <span className="md:tracking-widest">{title}</span>
              </h1>
            </div>
          </motion.h1>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: card.delay }}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 },
              }}
              className="h-full flex flex-col"
            >
              <Card className="h-full overflow-hidden rounded-3xl border-4 border-white/20 bg-white/10 backdrop-blur-lg shadow-2xl flex flex-col">
                <div className="relative h-86 overflow-hidden">
                  {index === 0 && !videoError ? (
                    <video
                      autoPlay
                      muted
                      loop
                      className="w-auto h-auto"
                      poster="/videos/hero1.jpg"
                      onError={() => setVideoError(true)}
                    >
                      <source
                        src={card.image?.replace(".png", ".mp4") || "/videos/hero1.mp4"}
                        type="video/mp4"
                      />
                      Tu navegador no soporta el video.
                    </video>
                  ) : (
                    <img
                      src={card.image || "/images/landing/hero-1.png"}
                      alt={card.title}
                      className="w-auto h-auto"
                    />
                  )}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"
                    style={{
                      background: `linear-gradient(to top, ${card.color}30 0%, transparent 70%)`,
                    }}
                  />
                </div>

                <CardContent className="p-8 flex flex-col flex-grow">
                  <div className="flex-grow">
                    <CardTitle
                      className="mb-4 text-3xl font-bold"
                      style={{ color: card.color }}
                    >
                      {card.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-blackOlive">
                      {card.description}
                    </CardDescription>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-6"
                  >
                    {card.url ? (
                      <a href={card.url} className="block w-full">
                        <Button
                          className="w-full rounded-xl py-6 text-lg font-bold text-white transition-all hover:bg-white/30"
                          style={{ backgroundColor: card.color }}
                        >
                          {card.buttonText}
                        </Button>
                      </a>
                    ) : null}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        animate={{
          y: [0, -20, 0],
          x: [0, 15, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/4 top-1/4 h-32 w-32 rounded-full bg-[#FF6B6B]/20"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-1/4 bottom-1/4 h-40 w-40 rounded-3xl border-4 border-[#4ECDC4]/20"
      />
    </section>
  );
};

export default Hero;

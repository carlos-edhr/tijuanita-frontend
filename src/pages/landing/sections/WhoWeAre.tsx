import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { cmsService, type CMSWhoWeAre, type CMSTeamMember } from "@/services/cmsService";
import { useLanguage } from "@/context/LanguageProvider";

interface WhoWeAreProps {
  content: CMSWhoWeAre | null;
}

const colors = ["#4ECDC4", "#FDE047", "#FF6B6B"];

const fallbackTeamMembers: CMSTeamMember[] = [
  {
    name: { es: "Tamara", en: "Tamara" },
    role: { es: "Licenciada en Turismo y mamá", en: "Tourism graduate and mom" },
    bio: { es: "Soy Tamara, licenciada en Turismo y mamá. En 2024, al vivir la primera vía recreativa de Tijuanita Mi Ciudad, recordé lo valioso de tener espacios seguros para jugar y convivir. Por eso me sumé a este proyecto, convencida de que la movilidad libre, la salud mental y el derecho de l@s niñ@s a disfrutar su ciudad deben ser una prioridad. Las vías recreativas son una oportunidad para reconectar con nuestra comunidad y fortalecer el amor por Tijuana.", en: "" },
    photo: "/images/landing/whoweare1.png",
    email: null,
    order: 0,
  },
  {
    name: { es: "Ana", en: "Ana" },
    role: { es: "Psicóloga socioambiental", en: "Socio-environmental psychologist" },
    bio: { es: "Soy Ana Karen, psicóloga socioambiental con interés en la educación y el desarrollo humano. Colaboro en Tijuanita para pasar de solo imaginar a poder crear espacios restauradores que promuevan derechos humanos y calidad de vida, mientras conocemos el mundo para enseñarnos a habitarlo con más amor.", en: "" },
    photo: "/images/landing/whoweare2.png",
    email: null,
    order: 1,
  },
  {
    name: { es: "Ivonne", en: "Ivonne" },
    role: { es: "Diseñadora y activista", en: "Designer and activist" },
    bio: { es: "Soy Ivonne, diseñadora y activista en temas de movilidad con perspectiva de género. Desde la seguridad vial, la justicia espacial y el cuidado nace mi impulso por abrir espacios de encuentro, juego y creatividad.", en: "" },
    photo: "/images/landing/whoweare3.png",
    email: null,
    order: 2,
  },
];

const WhoWeAre: React.FC<WhoWeAreProps> = ({ content }) => {
  const { getLocalizedValue } = useLanguage();
  const title = getLocalizedValue(content?.title);
  const description = getLocalizedValue(content?.content);
  const [teamMembers, setTeamMembers] = useState<CMSTeamMember[]>([]);
  const [loadingTeamMembers, setLoadingTeamMembers] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoadingTeamMembers(true);
        const teamSection = await cmsService.getTeamSection();
        if (teamSection && teamSection.members.length > 0) {
          setTeamMembers(teamSection.members);
        } else {
          const members = await cmsService.getPublicTeamMembers();
          if (members.length > 0) {
            setTeamMembers(members);
          } else {
            setTeamMembers(fallbackTeamMembers);
          }
        }
      } catch (error) {
        console.error("Failed to fetch team members:", error);
        setTeamMembers(fallbackTeamMembers);
      } finally {
        setLoadingTeamMembers(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const mappedMembers = teamMembers.map((member, index) => ({
    id: member.id || index,
    name: getLocalizedValue(member.name),
    image: member.photo || `/images/landing/whoweare${index + 1}.png`,
    color: colors[index % colors.length],
    role: getLocalizedValue(member.role),
    description: getLocalizedValue(member.bio),
  }));

  if (loadingTeamMembers) {
    return (
      <section
        id="whoweare"
        className="relative overflow-hidden bg-blancoHuesoFondo py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="h-16 bg-gray-200/30 rounded-lg animate-pulse max-w-2xl mx-auto mb-8" />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-gray-200/30 rounded-3xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="whoweare"
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
        className="absolute left-[10%] top-[15%] h-40 w-40 rounded-full bg-[#4ECDC4]/20 blur-xl"
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
        className="absolute left-[20%] bottom-[20%] h-32 w-32 bg-[#FDE047]/30 blur-xl"
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
        className="absolute right-[10%] bottom-[15%] h-20 w-20 bg-[#4ECDC4]/30 blur-lg"
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
        className="absolute left-[15%] top-[35%] h-16 w-16 bg-[#FF6B6B]/30 blur-lg"
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
            className="mx-auto mt-6 max-w-4xl text-lg text-gray-700 md:text-xl text-justify px-4"
          >
            {description || "Actividades organizadas por personas voluntarias de manera autogestivas, sin fines de lucro, partidistas o religiosos."}
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {mappedMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.2 }}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 },
              }}
              className="group relative overflow-hidden rounded-3xl bg-white/90 p-6 backdrop-blur-lg shadow-2xl"
            >
              <div className="relative h-64 overflow-hidden rounded-2xl mb-6">
                <img
                  src={member.image}
                  alt={member.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"
                  style={{
                    background: `linear-gradient(to top, ${member.color}40 0%, transparent 70%)`,
                  }}
                />
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {member.name}
                </h3>

                <div
                  className="inline-block rounded-full px-4 py-1 mb-4 text-sm font-semibold"
                  style={{
                    backgroundColor: `${member.color}20`,
                    color: member.color,
                  }}
                >
                  {member.role}
                </div>

                <p className="text-gray-600 mb-6 text-justify">
                  {member.description}
                </p>
              </div>

              <motion.div
                className="absolute -top-4 -right-4 h-16 w-16 rounded-full"
                style={{
                  backgroundColor: `${member.color}20`,
                  border: `3px solid ${member.color}20`,
                  zIndex: -1,
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 45, 0],
                }}
                transition={{
                  duration: 5 + index,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <motion.div
                className="absolute -bottom-3 -left-3 h-12 w-12"
                style={{
                  backgroundColor: `${member.color}20`,
                  border: `3px solid ${member.color}20`,
                  zIndex: -1,
                }}
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
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;

import { useState, useEffect } from "react";

const logos = [
  { url: "/images/logos-colaboradores/1.Delegación sin fondo.png" },
  { url: "/images/logos-colaboradores/2. EMC.png" },
  { url: "/images/logos-colaboradores/3. liga peatnal sin fondo.png" },
  { url: "/images/logos-colaboradores/4. Centro 32 sin fondo.png" },
  { url: "/images/logos-colaboradores/5. Circulo de Aikido sin fondo.png" },
  { url: "/images/logos-colaboradores/6.CTA.png" },
  { url: "/images/logos-colaboradores/7. gran vida sin fondo.png" },
];

const LogoCarousel: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative w-full h-[150px] mt-10">
      <div className="relative w-full h-full overflow-hidden flex justify-center">
        <div className="absolute w-[50%] h-full overflow-hidden">
          <div className="flex items-center animate-marquee">
            {[...logos, ...logos, ...logos].map((logo, index) => (
              <div
                key={index}
                className="mx-4 flex justify-center items-center flex-shrink-0"
              >
                <img
                  src={logo.url}
                  alt="Logo"
                  className="object-contain w-[170px] h-[170px]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          width: max-content;
        }
      `}</style>
    </div>
  );
};

export default LogoCarousel;

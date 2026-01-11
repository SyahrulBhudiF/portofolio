import { useIsMobile } from "@/hooks/useIsMobile";
import { type ISourceOptions, MoveDirection, OutMode } from "@tsparticles/engine";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useEffect, useMemo, useState } from "react";

const ParticlesHome: React.FC = () => {
  const [init, setInit] = useState(false);
  const isMobile = useIsMobile();

  const particleOptions: ISourceOptions = useMemo(
    () => ({
      background: {
        color: {
          value: "transparent",
        },
      },
      fpsLimit: isMobile ? 20 : 30,
      interactivity: {
        events: {
          onHover: {
            enable: !isMobile, // Disable hover on mobile for performance
            mode: "connect",
          },
        },
        modes: {
          connect: {
            distance: 80,
            links: {
              opacity: 0.2,
            },
            radius: 100,
          },
        },
      },
      particles: {
        color: {
          value: "#8A2BE2",
        },
        links: {
          enable: false,
        },
        move: {
          enable: true,
          speed: isMobile ? 0.2 : 0.3,
          direction: MoveDirection.none,
          random: true,
          straight: false,
          outModes: {
            default: OutMode.bounce,
          },
        },
        number: {
          density: {
            enable: true,
          },
          value: isMobile ? 15 : 40, // Reduce particle count on mobile
        },
        opacity: {
          value: { min: 0.2, max: 0.5 },
        },
        size: {
          value: { min: 1, max: isMobile ? 1.5 : 2 },
        },
        shape: {
          type: "circle",
        },
      },
      detectRetina: !isMobile, // Disable retina detection on mobile for performance
    }),
    [isMobile],
  );

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) {
    return null;
  }

  return (
    <Particles
      id="tsparticles"
      options={particleOptions}
      className="-z-10 overflow-hidden absolute inset-0 w-full h-full"
    />
  );
};

export default ParticlesHome;

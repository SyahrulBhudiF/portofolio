import {
  type ISourceOptions,
  MoveDirection,
  OutMode,
} from "@tsparticles/engine";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useEffect, useState } from "react";

// Define options outside component to avoid recreation
const particleOptions: ISourceOptions = {
  background: {
    color: {
      value: "transparent",
    },
  },
  fpsLimit: 30,
  interactivity: {
    events: {
      onHover: {
        enable: true,
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
      speed: 0.3,
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
      value: 40,
    },
    opacity: {
      value: { min: 0.2, max: 0.5 },
    },
    size: {
      value: { min: 1, max: 2 },
    },
    shape: {
      type: "circle",
    },
  },
  detectRetina: true,
};

const ParticlesHome: React.FC = () => {
  const [init, setInit] = useState(false);

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

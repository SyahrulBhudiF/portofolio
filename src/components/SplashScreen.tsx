import { AnimatePresence, motion } from "motion/react";
import {
  type FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface Config {
  fullText: string;
  promptText: string;
  responseText: string;
  timings: {
    typing: number;
    variance: number;
    delay: number;
    responseTyping: number;
    responseVariance: number;
    close: number;
    cursorBlink: number;
  };
}

interface Variants {
  splash: {
    initial: { opacity: number };
    exit: {
      opacity: number;
      scale: number;
      transition: {
        duration: number;
        ease: number[];
      };
    };
  };
  terminal: {
    initial: {
      scale: number;
      opacity: number;
      y: number;
    };
    animate: {
      scale: number;
      opacity: number;
      y: number;
      transition: {
        type: string;
        stiffness: number;
        damping: number;
        mass: number;
      };
    };
  };
  secondText: {
    initial: {
      opacity: number;
      y: number;
      scale: number;
    };
    animate: {
      opacity: number;
      y: number;
      scale: number;
      transition: {
        type: string;
        stiffness: number;
        damping: number;
        delay: number;
        duration: number;
      };
    };
  };
  cursor: {
    visible: { opacity: number };
    hidden: { opacity: number };
  };
}

interface CursorProps {
  show: boolean;
}

const Cursor: FC<CursorProps> = ({ show }) => (
  <motion.span
    className="inline-block w-2 h-5 bg-purple-300 ml-1"
    animate={{ opacity: show ? 1 : 0 }}
    transition={{
      duration: 0.15,
      ease: "easeInOut",
    }}
  />
);

const SplashScreen = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [typedText, setTypedText] = useState("");
  const [showSecondText, setShowSecondText] = useState(false);
  const [typedResponse, setTypedResponse] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  const timersRef = useRef<Set<NodeJS.Timeout>>(new Set());
  const animationFrameRef = useRef<number | null>(null);

  const config = useMemo<Config>(
    () => ({
      fullText: " sudo dnf install ryuko",
      promptText: " Is this ok [y/N]: ",
      responseText: "y",
      timings: {
        typing: 50,
        variance: 15,
        delay: 500,
        responseTyping: 800,
        responseVariance: 200,
        close: 400,
        cursorBlink: 600,
      },
    }),
    [],
  );

  const variants = useMemo<Variants>(
    () => ({
      splash: {
        initial: { opacity: 1 },
        exit: {
          opacity: 0,
          scale: 1.05,
          transition: {
            duration: 1.2,
            ease: [0.4, 0, 0.2, 1],
          },
        },
      },
      terminal: {
        initial: {
          scale: 0.95,
          opacity: 0,
          y: 30,
        },
        animate: {
          scale: 1,
          opacity: 1,
          y: 0,
          transition: {
            type: "spring",
            stiffness: 200,
            damping: 25,
            mass: 1,
          },
        },
      },
      secondText: {
        initial: {
          opacity: 0,
          y: 2,
          scale: 1,
        },
        animate: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: 0,
            duration: 1.0,
          },
        },
      },
      cursor: {
        visible: { opacity: 1 },
        hidden: { opacity: 0 },
      },
    }),
    [],
  );

  const getRandomDelay = useCallback(
    (base: number, variance: number): number => {
      return Math.max(base + Math.random() * variance - variance / 2, 10);
    },
    [],
  );

  const clearAllTimers = useCallback((): void => {
    for (const timer of timersRef.current) {
      clearTimeout(timer);
    }
    timersRef.current.clear();
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  const toggleBodyOverflow = useCallback((hide: boolean): void => {
    const body = document.body;
    if (hide) {
      body.style.overflow = "hidden";
      body.style.height = "100vh";
    } else {
      body.style.overflow = "";
      body.style.height = "";
    }
  }, []);

  useEffect(() => {
    const blinkTimer = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, config.timings.cursorBlink);

    return () => clearInterval(blinkTimer);
  }, [config.timings.cursorBlink]);

  useEffect(() => {
    if (typedText.length >= config.fullText.length) {
      if (!showSecondText) {
        const timer = setTimeout(() => {
          animationFrameRef.current = requestAnimationFrame(() => {
            setShowSecondText(true);
          });
        }, config.timings.delay);

        timersRef.current.add(timer);
        return () => {
          clearTimeout(timer);
          timersRef.current.delete(timer);
        };
      }
      return;
    }

    const delay = getRandomDelay(
      config.timings.typing,
      config.timings.variance,
    );
    const timer = setTimeout(() => {
      animationFrameRef.current = requestAnimationFrame(() => {
        setTypedText((prev) => prev + config.fullText[prev.length]);
      });
    }, delay);

    timersRef.current.add(timer);
    return () => {
      clearTimeout(timer);
      timersRef.current.delete(timer);
    };
  }, [
    typedText.length,
    config.fullText,
    config.timings.typing,
    config.timings.variance,
    config.timings.delay,
    showSecondText,
    getRandomDelay,
  ]);

  useEffect(() => {
    if (!showSecondText) return;

    if (typedResponse.length >= config.responseText.length) {
      const timer = setTimeout(() => {
        animationFrameRef.current = requestAnimationFrame(() => {
          setShowSplash(false);
        });
      }, config.timings.close);

      timersRef.current.add(timer);
      return () => {
        clearTimeout(timer);
        timersRef.current.delete(timer);
      };
    }

    const delay = getRandomDelay(
      config.timings.responseTyping,
      config.timings.responseVariance,
    );
    const timer = setTimeout(() => {
      animationFrameRef.current = requestAnimationFrame(() => {
        setTypedResponse((prev) => prev + config.responseText[prev.length]);
      });
    }, delay);

    timersRef.current.add(timer);
    return () => {
      clearTimeout(timer);
      timersRef.current.delete(timer);
    };
  }, [
    showSecondText,
    typedResponse.length,
    config.responseText,
    config.timings.responseTyping,
    config.timings.responseVariance,
    config.timings.close,
    getRandomDelay,
  ]);

  useEffect(() => {
    toggleBodyOverflow(showSplash);
    return () => toggleBodyOverflow(false);
  }, [showSplash, toggleBodyOverflow]);

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  return (
    <AnimatePresence mode="wait">
      {showSplash && (
        <motion.div
          className="splash-screen flex justify-center items-center w-full h-full bg-black z-40 inset-0 fixed"
          variants={variants.splash}
          initial="initial"
          exit="exit"
          style={{
            backfaceVisibility: "hidden",
            perspective: 1000,
          }}
        >
          <motion.div
            className="terminal border-2 border-purple-900/80 p-4 sm:p-6 w-[95%] sm:w-4/5 max-w-2xl h-auto min-h-52 bg-gray-950/95 backdrop-blur-sm overflow-hidden relative shadow-2xl shadow-purple-900/20 rounded-lg"
            variants={variants.terminal}
            initial="initial"
            animate="animate"
            style={{
              backfaceVisibility: "hidden",
            }}
          >
            <div className="absolute top-2 left-4 flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
            </div>

            <div className="mt-8 space-y-2">
              <div className="command-line text-lg leading-relaxed text-white font-mono break-words">
                <span className="text-purple-400 font-semibold">
                  ryuko@fedora
                </span>
                <span className="text-purple-300">:~$</span>
                <span className="command text-white">{typedText}</span>
                {!showSecondText && <Cursor show={showCursor} />}
              </div>

              <AnimatePresence mode="wait">
                {showSecondText && (
                  <motion.div
                    className="command-line text-lg leading-relaxed text-white font-mono break-words"
                    variants={variants.secondText}
                    initial="initial"
                    animate="animate"
                    exit="initial"
                  >
                    <span className="text-purple-400 font-semibold">
                      ryuko@fedora
                    </span>
                    <span className="text-purple-300">:~$</span>
                    <span className="command text-gray-300">
                      {config.promptText}
                    </span>
                    <span className="command text-white font-semibold">
                      {typedResponse}
                    </span>
                    {typedResponse.length < config.responseText.length && (
                      <Cursor show={showCursor} />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;

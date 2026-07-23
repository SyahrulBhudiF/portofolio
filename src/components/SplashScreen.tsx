import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const COMMAND = " sudo dnf install ryuko";
const PROMPT = " Is this ok [y/N]: ";
const RESPONSE = "y";

const splashVariants = {
  initial: { opacity: 1 },
  exit: {
    opacity: 0,
    scale: 1.05,
    transition: { duration: 1.2, ease: [0.4, 0, 0.2, 1] },
  },
};

const terminalVariants = {
  initial: { scale: 0.95, opacity: 0, y: 30 },
  animate: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 25, mass: 1 },
  },
};

const promptVariants = {
  initial: { opacity: 0, y: 2 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

function Cursor() {
  return <span aria-hidden className="ml-1 inline-block h-5 w-2 animate-pulse bg-purple-300" />;
}

function delay(base: number, variance = 0) {
  return Math.max(10, base + Math.random() * variance - variance / 2);
}

export default function SplashScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [typedCommand, setTypedCommand] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  const [typedResponse, setTypedResponse] = useState("");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let commandIndex = 0;
    let responseIndex = 0;

    const close = () => {
      timer = setTimeout(() => setShowSplash(false), 400);
    };

    const typeResponse = () => {
      if (responseIndex === RESPONSE.length) {
        close();
        return;
      }

      timer = setTimeout(
        () => {
          responseIndex += 1;
          setTypedResponse(RESPONSE.slice(0, responseIndex));
          typeResponse();
        },
        delay(800, 200),
      );
    };

    const showResponsePrompt = () => {
      timer = setTimeout(() => {
        setShowPrompt(true);
        typeResponse();
      }, 500);
    };

    const typeCommand = () => {
      if (commandIndex === COMMAND.length) {
        showResponsePrompt();
        return;
      }

      timer = setTimeout(
        () => {
          commandIndex += 1;
          setTypedCommand(COMMAND.slice(0, commandIndex));
          typeCommand();
        },
        delay(50, 15),
      );
    };

    typeCommand();
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showSplash ? "hidden" : "";
    document.body.style.height = showSplash ? "100vh" : "";

    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
    };
  }, [showSplash]);

  return (
    <AnimatePresence mode="wait">
      {showSplash && (
        <motion.div
          className="fixed inset-0 z-40 flex h-full w-full items-center justify-center bg-black"
          variants={splashVariants}
          initial="initial"
          exit="exit"
        >
          <motion.div
            className="relative h-auto min-h-52 w-[95%] max-w-2xl overflow-hidden rounded-lg border-2 border-purple-900/80 bg-gray-950/95 p-4 shadow-2xl shadow-purple-900/20 backdrop-blur-sm sm:w-4/5 sm:p-6"
            variants={terminalVariants}
            initial="initial"
            animate="animate"
          >
            <div className="absolute top-2 left-4 flex space-x-2">
              <div className="h-3 w-3 rounded-full bg-red-500/70" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
              <div className="h-3 w-3 rounded-full bg-green-500/70" />
            </div>

            <div className="mt-8 space-y-2 font-mono text-lg leading-relaxed text-white wrap-break-word">
              <div>
                <span className="font-semibold text-purple-400">ryuko@fedora</span>
                <span className="text-purple-300">:~$</span>
                <span>{typedCommand}</span>
                {!showPrompt && <Cursor />}
              </div>

              <AnimatePresence mode="wait">
                {showPrompt && (
                  <motion.div variants={promptVariants} initial="initial" animate="animate">
                    <span className="font-semibold text-purple-400">ryuko@fedora</span>
                    <span className="text-purple-300">:~$</span>
                    <span className="text-gray-300">{PROMPT}</span>
                    <span className="font-semibold">{typedResponse}</span>
                    {typedResponse.length < RESPONSE.length && <Cursor />}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

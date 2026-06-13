import { useEffect, useRef, useState } from "react";

const ROLES = [
  "Web Developer",
  "Full-Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "Bug Maker :v",
] as const;

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_/\\[]{}=+*?#";

const FRAME_MS = 35; // tick speed (lower = faster roll)
const LOCK_EVERY = 2; // frames before locking the next character
const HOLD_MS = 1600; // pause on a fully revealed word

const SliderHome = () => {
  const [display, setDisplay] = useState<string>(ROLES[0]);

  useEffect(() => {
    let roleIndex = 0;
    let revealed = ROLES[0].length;
    let frame = 0;
    let holding = true;
    let holdUntil = performance.now() + HOLD_MS;

    const id = window.setInterval(() => {
      const now = performance.now();

      if (holding) {
        if (now >= holdUntil) {
          holding = false;
          roleIndex = (roleIndex + 1) % ROLES.length;
          revealed = 0;
          frame = 0;
        }
        return;
      }

      const target = ROLES[roleIndex];
      frame += 1;
      if (frame % LOCK_EVERY === 0 && revealed < target.length) {
        revealed += 1;
      }

      let out = "";
      for (let i = 0; i < target.length; i++) {
        if (i < revealed || target[i] === " ") {
          out += target[i];
        } else {
          out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
      }
      setDisplay(out);

      if (revealed >= target.length) {
        holding = true;
        holdUntil = now + HOLD_MS;
      }
    }, FRAME_MS);

    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="text-white font-bold text-3xl max-sm:text-xl text-carousel inline-flex items-center w-[300px] max-sm:w-[170px] whitespace-nowrap font-mono tracking-tight">
      {display}
    </span>
  );
};

export default SliderHome;

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
interface IDCardProps {
  name?: string;
  title?: string;
  photoUrl?: string;
  logoUrl?: string;
  username?: string;
}
type ConsoleLine = { text: string; kind?: "in" | "out" | "sys" };
const EGG_MSG = "ᚹᛖ ᛏᚱᚢᛊᛏ ᛁᚾ ᛟᛞᛁᚾ ᛏᛁᛚᛚ ᚢᚨᛚᚺᚨᛚᛚᚨ";
const SPECIAL_PHOTO_URL = "https://i.imghippo.com/files/eeg1100koY.jpg";
const IDCard = ({
  name = "Debarun Das",
  title = "Software Engineer",
  photoUrl = "https://i.imghippo.com/files/AXh9009dMs.jpeg",
  logoUrl = "https://api.dicebear.com/7.x/initials/svg?seed=D",
  username = "Debarun2003",
}: IDCardProps) => {
  // View/flip
  const [isFlipped, setIsFlipped] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [idle, setIdle] = useState(false);
  // Mini-games / console
  const [locked, setLocked] = useState(true);
  const [typed, setTyped] = useState("");
  const [focusConsole, setFocusConsole] = useState(false);
  const [consoleInput, setConsoleInput] = useState("");
  const [consoleLines, setConsoleLines] = useState<ConsoleLine[]>([
    { text: "card.init() -> ready", kind: "sys" },
    { text: 'type "help" for commands', kind: "sys" },
  ]);
  // Easter eggs
  const [clicks, setClicks] = useState(0);
  const [showEgg, setShowEgg] = useState(false);
  // Shake effect on lock input
  const [shakeLock, setShakeLock] = useState(false);
  // Pulse glow on unlock success
  const [pulseGlow, setPulseGlow] = useState(false);
  // Photo URL state to support dynamic change on secret key
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState(photoUrl);
  // Motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-140, 140], [22, -22]);
  const rotateY = useTransform(x, [-140, 140], [-22, 22]);
  const tiltGlow = useTransform(x, [-140, 140], [0.25, 0.9]);
  // Constraints
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });
  // Auto flip until interaction
  useEffect(() => {
    let int: number | undefined;
    if (autoRotate) {
      int = window.setInterval(() => setIsFlipped((p) => !p), 6000);
    }
    return () => int && clearInterval(int);
  }, [autoRotate]);
  // Idle scanner trigger
  useEffect(() => {
    let idleTimer: number | undefined;
    const arm = () => {
      idleTimer && clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => setIdle(true), 3000);
    };
    arm();
    const onAny = () => {
      if (idle) setIdle(false);
      arm();
    };
    window.addEventListener("mousemove", onAny);
    window.addEventListener("click", onAny);
    window.addEventListener("keydown", onAny);
    return () => {
      window.removeEventListener("mousemove", onAny);
      window.removeEventListener("click", onAny);
      window.removeEventListener("keydown", onAny);
      idleTimer && clearTimeout(idleTimer);
    };
  }, [idle]);
  // Compute drag constraints so card never leaves screen
  const updateConstraints = () => {
    if (!wrapRef.current || !cardRef.current) return;
    const wrap = wrapRef.current.getBoundingClientRect();
    const card = cardRef.current.getBoundingClientRect();
    const pad = 16; // small breathing space
    // motion dragConstraints expect deltas relative to current position
    setConstraints({
      top: -(card.top - wrap.top - pad),
      left: -(card.left - wrap.left - pad),
      right: wrap.right - card.right - pad,
      bottom: wrap.bottom - card.bottom - pad,
    });
  };
  useEffect(() => {
    updateConstraints();
    const ro = new ResizeObserver(updateConstraints);
    wrapRef.current && ro.observe(wrapRef.current);
    window.addEventListener("resize", updateConstraints);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateConstraints);
    };
  }, []);
  // Hover tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (autoRotate) setAutoRotate(false);
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.6);
    y.set((e.clientY - cy) * 0.6);
  };
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  // Click / flip / egg
  const handleClick = () => {
    setIsFlipped((p) => !p);
    setAutoRotate(false);
    setClicks((c) => {
      const n = c + 1;
      if (n === 7 || n === 13) {
        setShowEgg(true);
        setTimeout(() => setShowEgg(false), 5000);
        pushConsole({ text: "easter.egg() -> revealed", kind: "sys" });
      }
      return n;
    });
  };
  // Console helpers
  const pushConsole = (ln: ConsoleLine) =>
    setConsoleLines((prev) => [...prev.slice(-10), ln]);
  const runCommand = (cmdRaw: string) => {
    const cmd = cmdRaw.trim();
    if (!cmd) return;
    pushConsole({ text: `$ ${cmd}`, kind: "in" });
    const [head, ...rest] = cmd.split(/\s+/);
    const arg = rest.join(" ");
    switch (head.toLowerCase()) {
      case "help":
        pushConsole({
          text: "help, whoami, title <text>, flip, lock, unlock <key>, clear, egg, rain, about",
          kind: "out",
        });
        break;
      case "whoami":
        pushConsole({ text: `${name} @${username}`, kind: "out" });
        break;
      case "title":
        if (arg) {
          pushConsole({ text: `title.set("${arg}")`, kind: "sys" });
          // NOTE: only visual feedback; not mutating prop
        } else pushConsole({ text: "usage: title <text>", kind: "out" });
        break;
      case "flip":
        setIsFlipped((p) => !p);
        pushConsole({ text: "card.flip()", kind: "sys" });
        break;
      case "lock":
        setLocked(true);
        pushConsole({ text: "lock engaged", kind: "sys" });
        break;
      case "unlock":
        if (arg === username) {
          setLocked(false);
          pushConsole({ text: "unlock success", kind: "sys" });
          setPulseGlow(true);
          setTimeout(() => setPulseGlow(false), 1500);
          setCurrentPhotoUrl(photoUrl); // reset to default photo if previously changed
        } else if (arg.toLowerCase() === "chess") {
          setLocked(false);
          pushConsole({
            text: "unlock success (chess key) - photo changed",
            kind: "sys",
          });
          setPulseGlow(true);
          setTimeout(() => setPulseGlow(false), 1500);
          setCurrentPhotoUrl(SPECIAL_PHOTO_URL);
        } else {
          pushConsole({ text: "unlock failed", kind: "out" });
          // trigger shake effect on failed unlock
          setShakeLock(true);
          setTimeout(() => setShakeLock(false), 300);
        }
        break;
      case "clear":
        setConsoleLines([]);
        break;
      case "egg":
        setShowEgg(true);
        setTimeout(() => setShowEgg(false), 5000);
        pushConsole({ text: "secret -> " + EGG_MSG, kind: "out" });
        break;
      case "rain":
        // quick scan animation pulse
        setIdle(true);
        setTimeout(() => setIdle(false), 1400);
        pushConsole({ text: "scan.rain()", kind: "sys" });
        break;
      case "about":
        pushConsole({
          text: "interactive hacker card v1.0 | framer-motion | tailwind",
          kind: "out",
        });
        break;
      default:
        pushConsole({ text: `command not found: ${head}`, kind: "out" });
    }
  };
  const onConsoleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      runCommand(consoleInput);
      setConsoleInput("");
    } else if (e.key === "`") {
      // prevent escaping the console with backtick
      e.preventDefault();
    }
  };
  // Glitch variants
  const glitch = useMemo(
    () => ({
      rest: { x: 0, y: 0, filter: "none" },
      hover: {
        x: [0, -1, 1, 0, 0],
        y: [0, 1, -1, 0, 0],
        filter: [
          "none",
          "contrast(1.2) hue-rotate(10deg)",
          "contrast(1.4) hue-rotate(-10deg)",
          "none",
          "none",
        ],
        transition: { duration: 0.35 },
      },
      tap: { scale: 0.98 },
    }),
    [],
  );
  return (
    <div
      ref={wrapRef}
      className="flex items-center justify-center h-full w-full bg-black" // keep background exactly as-is
    >
      <motion.div
        ref={cardRef}
        className={`relative w-72 h-[28rem] cursor-pointer select-none rounded-xl border border-green-500/30 bg-zinc-950/90 shadow-[0_0_24px_rgba(16,185,129,0.35)] overflow-hidden ${
          pulseGlow ? "pulse-glow" : ""
        }`}
        style={{
          perspective: 1000,
          rotateX,
          rotateY,
          boxShadow: useTransform(
            tiltGlow,
            [0, 1],
            [
              "0 0 16px rgba(16,185,129,0.35)",
              "0 0 36px rgba(16,185,129,0.75)",
            ],
          ),
        }}
        drag
        dragConstraints={constraints}
        dragElastic={0.15}
        dragTransition={{ power: 0.2, timeConstant: 220 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        variants={glitch}
        whileHover="hover"
        whileTap="tap"
        onDragEnd={() => {
          if (!cardRef.current || !wrapRef.current) return;
          const wrap = wrapRef.current.getBoundingClientRect();
          const card = cardRef.current.getBoundingClientRect();
          const near =
            card.left < wrap.left + 20 ||
            card.top < wrap.top + 20 ||
            card.right > wrap.right - 20 ||
            card.bottom > wrap.bottom - 20;
          if (near) {
            cardRef.current.animate(
              [
                { transform: "translate3d(0,0,0)" },
                { transform: "translate3d(-6px,0,0)" },
                { transform: "translate3d(6px,0,0)" },
                { transform: "translate3d(0,0,0)" },
              ],
              { duration: 220, easing: "cubic-bezier(.36,.07,.19,.97)" },
            );
          }
        }}
      >
        {/* Idle scan bar (doesn't change background) */}
        <AnimatePresence>
          {idle && (
            <>
              <motion.div
                className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-emerald-400/30 to-transparent pointer-events-none"
                initial={{ y: "-100%" }}
                animate={{ y: "100%" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 2,
                  ease: "easeInOut",
                }}
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(16, 185, 129, 0.3) 50%, transparent 100%)",
                  backgroundSize: "200% 100%",
                  backgroundPositionX: "0%",
                }}
              />
            </>
          )}
        </AnimatePresence>
        {/* Top bar / username (front only) */}
        {!isFlipped && (
          <div className="absolute top-0 left-0 w-full p-2 bg-black/70 z-10">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-green-500 mr-2 hover:scale-105 transition-transform duration-200">
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-emerald-400 font-mono text-xs">{username}</p>
            </div>
          </div>
        )}
        {/* Easter egg flash overlay (on top of everything, inside card only) */}
        <AnimatePresence>
          {showEgg && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/70 text-emerald-400 font-mono text-center px-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="space-y-2">
                <div className="text-lg">{EGG_MSG}</div>
                <div className="text-xs opacity-70">[sealed]</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Faces */}
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={isFlipped ? "back" : "front"}
            className="absolute w-full h-full"
            initial={{ rotateY: isFlipped ? -180 : 0, opacity: 0 }}
            animate={{ rotateY: isFlipped ? 0 : 0, opacity: 1 }}
            exit={{ rotateY: isFlipped ? 0 : -180, opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
            style={{ backfaceVisibility: "hidden" }}
          >
            {isFlipped ? (
              // BACK: Console + Unlock mini-game
              <div className="flex flex-col h-full">
                <div className="p-3 border-b border-emerald-500/30 bg-black/70">
                  <div className="text-emerald-400 font-mono text-sm">
                    /dev/card/console
                  </div>
                </div>
                {/* Lock panel */}
                {locked ? (
                  <div className="flex-1 p-4 flex flex-col items-center justify-center gap-3">
                    <div className="text-emerald-400 font-mono text-xs opacity-80">
                      access_key required: type your username to unlock
                    </div>
                    <input
                      value={typed}
                      onChange={(e) => setTyped(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          if (typed.trim() === username) {
                            setLocked(false);
                            setTyped("");
                            setPulseGlow(true);
                            setTimeout(() => setPulseGlow(false), 1500);
                            setCurrentPhotoUrl(photoUrl);
                          } else if (typed.trim().toLowerCase() === "chess") {
                            setLocked(false);
                            setPulseGlow(true);
                            setTimeout(() => setPulseGlow(false), 1500);
                            setCurrentPhotoUrl(SPECIAL_PHOTO_URL);
                          } else {
                            setShakeLock(true);
                            setTimeout(() => setShakeLock(false), 300);
                          }
                        }
                      }}
                      placeholder="> access_key"
                      className={`w-56 bg-black/70 border rounded px-2 py-1 text-emerald-400 outline-none font-mono text-sm placeholder-emerald-700 transition-transform ${
                        shakeLock ? "animate-shake" : ""
                      }`}
                      autoFocus
                    />
                    <div className="text-xs text-emerald-600">
                      hint:{" "}
                      {username.slice(
                        0,
                        Math.max(3, Math.floor(username.length / 3)),
                      )}
                      ***
                    </div>
                  </div>
                ) : (
                  // Console
                  <div className="flex-1 flex flex-col">
                    <div className="flex-1 overflow-auto p-3 space-y-1">
                      {consoleLines.map((l, i) => (
                        <div
                          key={i}
                          className={
                            "font-mono text-xs " +
                            (l.kind === "sys"
                              ? "text-emerald-300"
                              : l.kind === "in"
                                ? "text-emerald-500"
                                : "text-emerald-400")
                          }
                        >
                          {l.text}
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-emerald-500/30 p-2 flex items-center gap-2">
                      <motion.span
                        className="text-emerald-500 font-mono text-xs"
                        animate={{
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                          ease: "easeInOut",
                        }}
                      >
                        λ
                      </motion.span>
                      <input
                        value={consoleInput}
                        onChange={(e) => setConsoleInput(e.target.value)}
                        onKeyDown={onConsoleKey}
                        onFocus={() => setFocusConsole(true)}
                        onBlur={() => setFocusConsole(false)}
                        placeholder="try: help"
                        className={
                          "flex-1 bg-black/70 border rounded px-2 py-1 text-emerald-400 outline-none font-mono text-sm placeholder-emerald-700 " +
                          (focusConsole
                            ? "border-emerald-400/70 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                            : "border-emerald-500/30")
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // FRONT: Photo side with subtle hacker effects
              <motion.div
                className="relative h-full"
                animate={{ filter: ["none", "none", "none", "saturate(1.15)"] }}
                transition={{ duration: 1.2 }}
              >
                <motion.img
                  src={currentPhotoUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                  whileHover={{
                    scale: 1.02,
                    filter: "contrast(1.15) brightness(1.05)",
                  }}
                  transition={{ type: "spring", stiffness: 180, damping: 18 }}
                />
                <motion.div
                  className="absolute bottom-0 left-0 w-full p-3 bg-black/80"
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <div className="text-emerald-400 font-mono">
                    <div className="font-bold text-emerald-500">{name}</div>
                    {/* typing effect subtitle */}
                    <TypingLine text={title} />
                    <div className="text-xs opacity-80">@{username}</div>
                  </div>
                </motion.div>
                {/* subtle corner brackets */}
                <div className="absolute inset-0 pointer-events-none">
                  <Corner p="tl" />
                  <Corner p="tr" />
                  <Corner p="bl" />
                  <Corner p="br" />
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
        {/* Footer tag (unchanged) */}
        <div className="absolute -bottom-6 left-0 right-0 text-center text-green-500 font-mono text-xs">
          [Interactive 3D Card]
        </div>
      </motion.div>
    </div>
  );
};
export default IDCard;
/* ---------- helpers ---------- */
const Corner = ({ p }: { p: "tl" | "tr" | "bl" | "br" }) => {
  const base = "absolute w-6 h-6 border-2 border-emerald-500/50";
  const pos =
    p === "tl"
      ? "top-2 left-2 border-b-0 border-r-0"
      : p === "tr"
        ? "top-2 right-2 border-b-0 border-l-0"
        : p === "bl"
          ? "bottom-2 left-2 border-t-0 border-r-0"
          : "bottom-2 right-2 border-t-0 border-l-0";
  return <div className={`${base} ${pos}`} />;
};
const TypingLine = ({ text }: { text: string }) => {
  const [shown, setShown] = useState("");
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 26);
    return () => clearInterval(id);
  }, [text]);
  return (
    <div className="text-sm">
      <span className="after:content-['▊'] after:ml-1 after:animate-pulse">
        {shown}
      </span>
    </div>
  );
};

/* Add shake animation CSS - add this to your global CSS or Tailwind config */
const style = document.createElement("style");
style.innerHTML = `
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-4px); }
  40%, 80% { transform: translateX(4px); }
}
.animate-shake {
  animation: shake 0.3s ease-in-out;
}
.pulse-glow {
  animation: pulse-glow 1.5s ease-in-out forwards;
}
@keyframes pulse-glow {
  0% { box-shadow: 0 0 24px rgba(16,185,129,0.75); }
  50% { box-shadow: 0 0 48px rgba(16,185,129,1); }
  100% { box-shadow: 0 0 24px rgba(16,185,129,0.75); }
}
`;
document.head.appendChild(style);

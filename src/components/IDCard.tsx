import React, { useState, useEffect, useRef } from "react";
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

const IDCard = ({
  name = "Debarun Das",
  title = "Software Engineer",
  photoUrl = "https://i.imghippo.com/files/AXh9009dMs.jpeg",
  logoUrl = "https://api.dicebear.com/7.x/initials/svg?seed=D",
  username = "Debarun2003",
}: IDCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const rotationInterval = useRef<number | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  useEffect(() => {
    if (autoRotate) {
      rotationInterval.current = window.setInterval(() => {
        setIsFlipped((prev) => !prev);
      }, 5000) as unknown as number;
    } else if (rotationInterval.current) {
      clearInterval(rotationInterval.current);
    }

    return () => {
      if (rotationInterval.current) {
        clearInterval(rotationInterval.current);
      }
    };
  }, [autoRotate]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (autoRotate) setAutoRotate(false);

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = () => {
    setIsFlipped((prev) => !prev);
    setAutoRotate(false);
  };

  return (
    <div className="flex items-center justify-center h-full w-full bg-black">
      <motion.div
        className="relative w-64 h-96 cursor-pointer"
        style={{
          perspective: 1000,
          rotateX,
          rotateY,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={isFlipped ? "back" : "front"}
            className="absolute w-full h-full rounded-xl border border-green-500/30 bg-zinc-900 shadow-lg shadow-green-500/20 overflow-hidden"
            initial={{ rotateY: isFlipped ? -180 : 0, opacity: 0 }}
            animate={{ rotateY: isFlipped ? 0 : 0, opacity: 1 }}
            exit={{ rotateY: isFlipped ? 0 : -180, opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ backfaceVisibility: "hidden" }}
          >
            {isFlipped ? (
              // Logo side
              <div className="flex flex-col items-center justify-center h-full p-4 bg-zinc-900">
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-green-500 mb-4">
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <h2 className="text-green-500 text-xl font-mono font-bold">
                    {name}
                  </h2>
                  <p className="text-green-400 font-mono">{title}</p>
                  <p className="text-green-300 font-mono mt-2">@{username}</p>
                </div>
              </div>
            ) : (
              // Photo side
              <div className="relative h-full">
                <div className="absolute top-0 left-0 w-full p-2 bg-zinc-900/80 z-10">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-green-500 mr-2">
                      <img
                        src={logoUrl}
                        alt="Logo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-green-500 font-mono text-xs">
                      {username}
                    </p>
                  </div>
                </div>
                <img
                  src={photoUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full p-2 bg-zinc-900/80">
                  <h2 className="text-green-500 font-mono font-bold">{name}</h2>
                  <p className="text-green-400 font-mono text-sm">{title}</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-[-30px] left-0 right-0 text-center text-green-500 font-mono text-xs">
          [Interactive 3D Card]
        </div>
      </motion.div>
    </div>
  );
};

export default IDCard;

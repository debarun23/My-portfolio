import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import IDCard from "./IDCard";
import TerminalInterface from "./TerminalInterface";
import PortfolioContent from "./PortfolioContent";

const Home = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeCommand, setActiveCommand] = useState("welcome");
  const [isMobile, setIsMobile] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Detect mobile
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Format date + time
  const formattedDateTime = currentTime
    .toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(",", "");

  // Commands for nav
  const commands = [
    "help",
    "about",
    "projects",
    "skills",
    "experience",
    "contact",
    "education",
    "certifications",
    "leadership",
    "sudo",
    "clear",
  ];

  return (
    <div className="flex flex-col h-screen w-full bg-black text-green-500 font-mono">
      {/* ---------------- NAV BAR ---------------- */}
      <nav className="border-b border-green-500/30 p-2">
        <div className="flex flex-wrap justify-center gap-2 md:gap-4">
          {commands.map((command) => (
            <button
              key={command}
              onClick={() => setActiveCommand(command)}
              className="hover:text-green-400 transition-colors"
            >
              {command}
            </button>
          ))}
        </div>
      </nav>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <div
        className={`flex ${
          isMobile ? "flex-col space-y-4 p-3" : "flex-row gap-4 p-4"
        } flex-1 overflow-hidden`}
      >
        {/* Left - ID Card */}
        <motion.div
          className={`${
            isMobile ? "w-full h-auto" : "w-1/3"
          } flex items-center justify-center border border-green-500/30 rounded-lg p-4`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <IDCard />
        </motion.div>

        {/* Right - Terminal */}
        <motion.div
          className={`${
            isMobile ? "w-full h-auto" : "w-2/3"
          } border border-green-500/30 rounded-lg p-4 overflow-hidden`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <TerminalInterface
            activeCommand={activeCommand}
            setActiveCommand={setActiveCommand}
            portfolioContent={PortfolioContent}
          />
        </motion.div>
      </div>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="border-t border-green-500/30 p-2 flex justify-end">
        <span className="text-sm">{formattedDateTime}</span>
      </footer>
    </div>
  );
};

export default Home;

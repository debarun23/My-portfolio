import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Separator } from "./ui/separator";

interface Command {
  input: string;
  output: React.ReactNode;
  timestamp: Date;
  isTyping?: boolean;
}

interface TerminalInterfaceProps {
  activeCommand?: string;
  setActiveCommand?: (command: string) => void;
  portfolioContent?: {
    about: React.ReactNode;
    projects: React.ReactNode;
    skills: React.ReactNode;
    experience: React.ReactNode;
    contact: React.ReactNode;
    education: React.ReactNode;
    certifications: React.ReactNode;
    leadership: React.ReactNode;
  };
}

// Simple typing effect component for strings
const TypingText: React.FC<{
  text: string;
  speed?: number;
  onComplete?: () => void;
}> = ({ text, speed = 30, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return <>{displayedText}</>;
};

const TerminalInterface: React.FC<TerminalInterfaceProps> = ({
  activeCommand,
  setActiveCommand,
  portfolioContent = {
    about: (
      <div>
        I am a B.Tech graduate in Electronics and Communication Engineering with
        expertise in full-stack development, cloud computing, and AI
        technologies.
        <br />
        <br />
        Proficient in Java, JavaScript, React.js, Next.js, SQL, and Docker, I
        enjoy creating scalable, intelligent, and user-focused solutions.
        <br />
        <br />
        With a strong foundation in REST APIs, OOP, Agile methodology, CI/CD,
        and responsive design, I am eager to contribute to the industry, solve
        real-world problems, and drive innovation through impactful software
        development.
      </div>
    ),
    projects: (
      <div>
        <div className="mb-4">
          <div className="font-bold">Terratech</div>
          <div>
            A sustainable agriculture platform using IoT and machine learning
          </div>
        </div>
        <div className="mb-4">
          <div className="font-bold">Crypto Tracker</div>
          <div>
            Real-time cryptocurrency tracking application with price alerts
          </div>
        </div>
      </div>
    ),
    skills: (
      <div>
        <div className="mb-2">
          <span className="font-bold">Languages:</span> JavaScript, TypeScript,
          Java, Python, HTML, CSS
        </div>
        <div className="mb-2">
          <span className="font-bold">Frameworks:</span> React.js, Next.js,
          Node.js, Express.js
        </div>
        <div className="mb-2">
          <span className="font-bold">Databases:</span> MongoDB, PostgreSQL,
          MySQL
        </div>
        <div className="mb-2">
          <span className="font-bold">Tools:</span> Git, Docker, AWS, CI/CD,
          Figma
        </div>
      </div>
    ),
    experience: (
      <div>
        <div className="mb-4">
          <div className="font-bold">IBM</div>
          <div className="italic">Software Development Intern</div>
          <div>May 2023 - August 2023</div>
          <ul className="list-disc pl-5 mt-2">
            <li>Developed microservices using Java Spring Boot</li>
            <li>
              Implemented CI/CD pipelines for automated testing and deployment
            </li>
            <li>
              Collaborated with cross-functional teams to deliver features
            </li>
          </ul>
        </div>
      </div>
    ),
    contact: (
      <div>
        <div className="mb-2">
          <span className="font-bold">Email:</span> example@example.com
        </div>
        <div className="mb-2">
          <span className="font-bold">GitHub:</span> github.com/username
        </div>
        <div className="mb-2">
          <span className="font-bold">LinkedIn:</span> linkedin.com/in/username
        </div>
      </div>
    ),
    education: (
      <div>
        <div className="mb-4">
          <div className="font-bold">
            B.Tech in Electronics and Communication Engineering
          </div>
          <div>University Name</div>
          <div>2019 - 2023</div>
        </div>
        <div className="mb-4">
          <div className="font-bold">Higher Secondary Education</div>
          <div>School Name</div>
          <div>2017 - 2019</div>
        </div>
      </div>
    ),
    certifications: (
      <div>
        <div className="mb-2">
          Meta Front-End Developer Professional Certificate
        </div>
        <div className="mb-2">
          Deloitte Technology Consulting Virtual Internship
        </div>
        <div className="mb-2">SQL Bootcamp Certification</div>
        <div className="mb-2">Full-Stack Web Development Bootcamp</div>
      </div>
    ),
    leadership: (
      <div>
        <div className="mb-4">
          <div className="font-bold">IoT Project Lead</div>
          <div>
            Led a team of 5 in developing an IoT-based smart agriculture system
          </div>
        </div>
        <div className="mb-4">
          <div className="font-bold">Technical Fest Coordinator</div>
          <div>Organized and managed technical events at university level</div>
        </div>
        <div className="mb-4">
          <div className="font-bold">Student Mentor</div>
          <div>
            Mentored junior students in programming and project development
          </div>
        </div>
      </div>
    ),
  },
}) => {
  const [commands, setCommands] = useState<Command[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [cursorVisible, setCursorVisible] = useState(true);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage = (
      <div>
        <div className="text-green-400 text-lg font-bold mb-4">
          <TypingText
            text="Welcome to Debarun's Portfolio Terminal"
            speed={50}
          />
        </div>
        <div className="mb-2">
          <TypingText
            text="Type 'help' to see available commands or click on the navigation above."
            speed={30}
          />
        </div>
        <div className="text-sm text-green-300">
          <TypingText
            text="Navigate through my portfolio using terminal commands!"
            speed={30}
          />
        </div>
      </div>
    );

    setCommands([
      {
        input: "welcome",
        output: welcomeMessage,
        timestamp: new Date(),
        isTyping: true,
      },
    ]);
  }, []);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  // Auto-scroll to bottom when commands change
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  // Focus input when terminal is clicked
  useEffect(() => {
    const handleClick = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const processCommand = (input: string) => {
    const trimmedInput = input.trim().toLowerCase();
    let output: React.ReactNode;

    switch (trimmedInput) {
      case "help":
        output = (
          <div>
            <div className="text-green-400">
              <TypingText text="Available commands:" speed={20} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              <div>
                <span className="text-green-400">about</span> -{" "}
                <TypingText text="Learn about me" speed={20} />
              </div>
              <div>
                <span className="text-green-400">projects</span> -{" "}
                <TypingText text="View my projects" speed={20} />
              </div>
              <div>
                <span className="text-green-400">skills</span> -{" "}
                <TypingText text="See my technical skills" speed={20} />
              </div>
              <div>
                <span className="text-green-400">experience</span> -{" "}
                <TypingText text="My work experience" speed={20} />
              </div>
              <div>
                <span className="text-green-400">contact</span> -{" "}
                <TypingText text="How to reach me" speed={20} />
              </div>
              <div>
                <span className="text-green-400">education</span> -{" "}
                <TypingText text="My educational background" speed={20} />
              </div>
              <div>
                <span className="text-green-400">certifications</span> -{" "}
                <TypingText text="View my certifications" speed={20} />
              </div>
              <div>
                <span className="text-green-400">leadership</span> -{" "}
                <TypingText
                  text="Leadership and community involvement"
                  speed={20}
                />
              </div>
              <div>
                <span className="text-green-400">clear</span> -{" "}
                <TypingText text="Clear the terminal" speed={20} />
              </div>
            </div>
            <div className="mt-4">
              <TypingText text="Type any command to continue..." speed={20} />
            </div>
          </div>
        );
        break;
      case "about":
        output = (
          <div>
            <TypingText
              text="I am a B.Tech graduate in Electronics and Communication Engineering with expertise in full-stack development, cloud computing, and AI technologies."
              speed={10}
            />
            <br />
            <br />
            <TypingText
              text="Proficient in Java, JavaScript, React.js, Next.js, SQL, and Docker, I enjoy creating scalable, intelligent, and user-focused solutions."
              speed={10}
            />
            <br />
            <br />
            <TypingText
              text="With a strong foundation in REST APIs, OOP, Agile methodology, CI/CD, and responsive design, I am eager to contribute to the industry, solve real-world problems, and drive innovation through impactful software development."
              speed={10}
            />
          </div>
        );
        break;
      case "projects":
        output = portfolioContent.projects || <div>No data available</div>;
        break;
      case "skills":
        output = portfolioContent.skills || <div>No data available</div>;
        break;
      case "experience":
        output = portfolioContent.experience || <div>No data available</div>;
        break;
      case "contact":
        output = portfolioContent.contact || <div>No data available</div>;
        break;
      case "education":
        output = portfolioContent.education || <div>No data available</div>;
        break;
      case "certifications":
        output = portfolioContent.certifications || (
          <div>No data available</div>
        );
        break;
      case "leadership":
        output = portfolioContent.leadership || <div>No data available</div>;
        break;
      case "clear":
        setCommands([]);
        return;
      case "sudo":
        output = (
          <div className="text-red-500">
            <TypingText text="Permission denied: Nice try! 😉" speed={20} />
          </div>
        );
        break;
      case "":
        return;
      default:
        output = (
          <div>
            <TypingText
              text={`Command not found: ${trimmedInput}. Type 'help' for available commands.`}
              speed={10}
            />
          </div>
        );
    }

    const newCommand: Command = {
      input: trimmedInput,
      output,
      timestamp: new Date(),
      isTyping: true,
    };

    setCommands((prev) => [...prev, newCommand]);
    setCommandHistory((prev) => [trimmedInput, ...prev]);
    setHistoryIndex(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      processCommand(currentInput);
      setCurrentInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (
        commandHistory.length > 0 &&
        historyIndex < commandHistory.length - 1
      ) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput("");
      }
    }
  };

  const handleNavigation = (section: string) => {
    processCommand(section);
    if (setActiveCommand) {
      setActiveCommand(section);
    }
  };

  // Handle external command changes
  useEffect(() => {
    if (activeCommand && activeCommand !== "welcome") {
      processCommand(activeCommand);
    }
  }, [activeCommand]);

  return (
    <div className="flex flex-col h-full bg-black text-green-400 font-mono">
      {/* Terminal output area */}
      <div
        ref={terminalRef}
        className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-green-800 scrollbar-track-black"
      >
        {commands.map((command, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-center">
              <span className="text-blue-400">debarun@portfolio:~$</span>
              <span className="ml-2">{command.input}</span>
            </div>
            <div className="mt-1 ml-0">{command.output}</div>
          </div>
        ))}

        {/* Current input line */}
        <div className="flex items-center">
          <span className="text-blue-400">debarun@portfolio:~$</span>
          <div className="relative ml-2 flex-1">
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              className="w-full bg-transparent outline-none text-green-400 caret-transparent"
              autoFocus
            />
            {cursorVisible && (
              <span
                className="absolute top-0 left-0 ml-[length:var(--cursor-position)]"
                style={
                  {
                    "--cursor-position": `${currentInput.length * 8}px`,
                  } as React.CSSProperties
                }
              >
                <motion.div
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="h-5 w-2 bg-green-400"
                />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalInterface;

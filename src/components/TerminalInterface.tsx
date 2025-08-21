import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

// Import your sound files appropriately or remove these imports
// import moveSoundFile from "./move-sound.mp3";
// import checkmateSoundFile from "./checkmate-sound.mp3";

interface Command {
  input: string;
  output: React.ReactNode;
  timestamp: Date;
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

const TypingText: React.FC<{ text: string; speed?: number }> = ({
  text,
  speed = 100,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  return <>{displayedText}</>;
};

const pieceValue: Record<string, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};

function evaluateBoard(game: Chess) {
  const board = game.board();
  let value = 0;
  board.forEach((row) =>
    row.forEach((piece) => {
      if (piece !== null) {
        const val = pieceValue[piece.type];
        value += piece.color === "w" ? val : -val;
      }
    }),
  );
  return value;
}

function minimaxRoot(depth: number, game: Chess) {
  const moves = game.moves();
  let bestMove = null;
  let bestValue = -Infinity;

  for (const move of moves) {
    game.move(move);
    const val = -minimax(depth - 1, game, -Infinity, Infinity, false);
    game.undo();
    const randomFactor = Math.random() * 0.5; // to lower AI strength

    if (val + randomFactor > bestValue) {
      bestValue = val + randomFactor;
      bestMove = move;
    }
  }
  return bestMove;
}

function minimax(
  depth: number,
  game: Chess,
  alpha: number,
  beta: number,
  isMaximizingPlayer: boolean,
): number {
  if (depth === 0 || game.isGameOver()) {
    return evaluateBoard(game);
  }

  const moves = game.moves();
  if (isMaximizingPlayer) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      maxEval = Math.max(maxEval, minimax(depth - 1, game, alpha, beta, false));
      game.undo();
      alpha = Math.max(alpha, maxEval);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move);
      minEval = Math.min(minEval, minimax(depth - 1, game, alpha, beta, true));
      game.undo();
      beta = Math.min(beta, minEval);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

const ChessGame: React.FC = () => {
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [gameOverMessage, setGameOverMessage] = useState<string | null>(null);

  // Uncomment if you want sound effects and add corresponding files
  // const moveAudio = useRef<HTMLAudioElement | null>(null);
  // const checkmateAudio = useRef<HTMLAudioElement | null>(null);
  //
  // useEffect(() => {
  //   moveAudio.current = new Audio(moveSoundFile);
  //   checkmateAudio.current = new Audio(checkmateSoundFile);
  // }, []);

  function safeGameMutate(modify: (g: Chess) => void) {
    setGame((g) => {
      const newGame = new Chess(g.fen());
      modify(newGame);
      // if (moveAudio.current) moveAudio.current.play();

      if (newGame.isCheckmate()) {
        // if (checkmateAudio.current) checkmateAudio.current.play();
        const playerTurn = newGame.turn();
        let resultMsg = "";
        if (playerTurn === "w") {
          resultMsg = "Checkmate! You lost the match.";
        } else {
          resultMsg = "Checkmate! You won the match!";
        }

        const board = newGame.board();
        let whiteScore = 0;
        let blackScore = 0;
        board.forEach((row) =>
          row.forEach((piece) => {
            if (piece) {
              const val = pieceValue[piece.type];
              if (piece.color === "w") whiteScore += val;
              else blackScore += val;
            }
          }),
        );
        resultMsg += ` Final material score — White: ${whiteScore} | Black: ${blackScore}`;
        setGameOverMessage(resultMsg);
      } else {
        setGameOverMessage(null);
      }
      return newGame;
    });
  }

  function makeAIMove(gameInstance: Chess) {
    if (gameInstance.isGameOver()) return;
    const bestMove = minimaxRoot(2, gameInstance);
    if (bestMove) {
      gameInstance.move(bestMove);
    }
  }

  function onDrop(source: string, target: string) {
    let move = null;
    safeGameMutate((game) => {
      move = game.move({ from: source, to: target, promotion: "q" });
    });

    setSelectedSquare(null);
    setLegalMoves([]);

    if (move !== null) {
      setTimeout(() => {
        safeGameMutate((game) => {
          makeAIMove(game);
        });
      }, 600);
      return true;
    }
    return false;
  }

  function onSquareClick(square: string) {
    if (selectedSquare === square) {
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }
    setSelectedSquare(square);
    const moves = game.moves({ square, verbose: true });
    setLegalMoves(moves.map((m) => m.to));
  }

  const customSquareStyles: Record<string, React.CSSProperties> = {};
  if (selectedSquare) {
    customSquareStyles[selectedSquare] = {
      backgroundColor: "rgba(255, 255, 0, 0.6)",
    };
  }
  legalMoves.forEach((sq) => {
    customSquareStyles[sq] = {
      backgroundColor: "rgba(0, 255, 0, 0.6)",
    };
  });

  return (
    <div className="flex flex-col items-center">
      <div className="text-green-400 font-bold mb-2">
        ♟️ Easter Egg Unlocked: Play Chess vs AI!
      </div>
      <div style={{ maxWidth: 320, width: "100%" }}>
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
          boardWidth={320}
          onSquareClick={onSquareClick}
          customSquareStyles={customSquareStyles}
          areSquaresSelectable={!gameOverMessage}
        />
      </div>
      {gameOverMessage && (
        <div className="text-red-500 font-bold mt-4 px-2 text-center">
          {gameOverMessage}
        </div>
      )}
      <div className="text-sm text-gray-400 mt-2">
        Type <span className="text-green-400">clear</span> to exit the game.
      </div>
    </div>
  );
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
          <div className="font-bold text-green-300">
            Terratech: AI-based Agricultural Monitoring System
          </div>
          <div className="text-sm text-gray-300 mb-2">
            IoT • Machine Learning • Computer Vision
          </div>
          <div className="mb-2">
            Designed and developed an IoT solution with ESP32-CAM and
            multi-sensors for real-time crop health monitoring.
          </div>
          <ul className="list-disc pl-5 text-sm">
            <li>
              Applied Edge Impulse and OpenCV for on-device image classification
              with 95% accuracy
            </li>
            <li>
              Engineered autonomous robotic vehicle for targeted pesticide
              application
            </li>
            <li>
              Optimized irrigation control system increasing crop yield by 17.4%
              and reducing water usage by 28.6%
            </li>
            <li>
              Configured cloud integration with Firebase and Blynk for real-time
              alerts
            </li>
          </ul>
        </div>
        <div className="mb-4">
          <div className="font-bold text-green-300">
            Crypto Price Tracker Dashboard
          </div>
          <div className="text-sm text-gray-300 mb-2">
            React.js • REST API • Data Visualization
          </div>
          <div className="mb-2">
            Built a React.js single-page application to track real-time prices
            of 50+ cryptocurrencies using CoinGecko REST API.
          </div>
          <ul className="list-disc pl-5 text-sm">
            <li>
              Leveraged React Hooks for state management and Google Charts for
              data visualization
            </li>
            <li>
              Migrated build process to Vite, reducing frontend load times by
              40%
            </li>
            <li>
              Refactored codebase into 15+ reusable components, accelerating
              feature integration by 25%
            </li>
          </ul>
        </div>
      </div>
    ),
    skills: (
      <div>
        <div className="mb-3">
          <span className="font-bold text-green-300">Languages:</span>
          <span className="ml-2">Java, JavaScript, C, SQL, HTML, CSS</span>
        </div>
        <div className="mb-3">
          <span className="font-bold text-green-300">
            Frameworks & Libraries:
          </span>
          <span className="ml-2">React.js, Next.js, Bootstrap</span>
        </div>
        <div className="mb-3">
          <span className="font-bold text-green-300">Tools & Platforms:</span>
          <span className="ml-2">
            Git, GitHub, Docker, IBM Cloud, IBM Watson, VS Code, Eclipse,
            IntelliJ IDEA
          </span>
        </div>
        <div className="mb-3">
          <span className="font-bold text-green-300">Databases:</span>
          <span className="ml-2">MySQL, PostgreSQL</span>
        </div>
        <div className="mb-3">
          <span className="font-bold text-green-300">Concepts:</span>
          <span className="ml-2">
            REST APIs, Full-Stack Development, OOP, Agile Methodology, CI/CD,
            Responsive Design, SDLC
          </span>
        </div>
      </div>
    ),
    experience: (
      <div>
        <div className="mb-4">
          <div className="font-bold text-green-300">
            Edunet Foundation – IBM SkillsBuild
          </div>
          <div className="text-sm text-gray-300">
            AI & Cloud Technologies Intern | July 2025 – August 2025 | Remote
          </div>
          <ul className="list-disc pl-5 mt-2 text-sm">
            <li>
              Designed an agentic AI agent with IBM Granite and RAG, integrating
              RESTful APIs to automate interview preparation workflows
            </li>
            <li>
              Automated job market data collection from 10+ portals, increasing
              content relevance by 40%
            </li>
            <li>
              Generated 100+ customizable interview questions with model answers
              using large language models, improving candidate preparation by
              35%
            </li>
            <li>
              Optimized backend processes for rapid response, maintaining under
              3-second output times using IBM Cloud and Watsonx.ai
            </li>
            <li>
              Deployed CI/CD pipelines to streamline agent deployment and reduce
              release cycles
            </li>
          </ul>
        </div>
      </div>
    ),
    contact: (
      <div>
        <div className="mb-2">
          <span className="font-bold text-green-300">Email:</span>
          <span className="ml-2">debarundas237@gmail.com</span>
        </div>
        <div className="mb-2">
          <span className="font-bold text-green-300">Phone:</span>
          <span className="ml-2">+91-9163048473</span>
        </div>
        <div className="mb-2">
          <span className="font-bold text-green-300">GitHub:</span>
          <span className="ml-2">github.com/debarun23</span>
        </div>
        <div className="mb-2">
          <span className="font-bold text-green-300">LinkedIn:</span>
          <span className="ml-2">linkedin.com/in/debarun-das</span>
        </div>
      </div>
    ),
    education: (
      <div>
        <div className="mb-4">
          <div className="font-bold text-green-300">
            Future Institute of Engineering and Management
          </div>
          <div className="text-sm text-gray-300">
            B.Tech in Electronics and Communication Engineering | CGPA:
            7.61/10.0
          </div>
          <div className="text-sm">Aug 2021 – July 2025 | Kolkata, WB</div>
          <div className="text-sm mt-1">
            Relevant Coursework: Data Structures, Software Engineering, APIs,
            Cloud Computing, Communication Systems, IoT
          </div>
        </div>
        <div className="mb-4">
          <div className="font-bold text-green-300">
            Mitra Institution (Bhowanipur Branch)
          </div>
          <div className="text-sm text-gray-300">
            Higher Secondary (Class XII) | Science (PCMB) | Percentage: 78%
          </div>
          <div className="text-sm">2021 | Kolkata, WB</div>
          <div className="text-sm mt-1">
            Board: West Bengal Council of Higher Secondary Education (WBCHSE)
          </div>
        </div>
      </div>
    ),
    certifications: (
      <div>
        <div className="mb-3">
          <div className="font-bold text-green-300">
            Meta Front-End Developer Professional Certificate
          </div>
          <div className="text-sm text-gray-300">May 2025 - Present</div>
        </div>
        <div className="mb-3">
          <div className="font-bold text-green-300">
            Deloitte Australia - Technology Job Simulation
          </div>
          <div className="text-sm text-gray-300">June 2025 - July 2025</div>
        </div>
        <div className="mb-3">
          <div className="font-bold text-green-300">
            The Complete SQL Bootcamp
          </div>
          <div className="text-sm text-gray-300">May 2024 - July 2024</div>
        </div>
        <div className="mb-3">
          <div className="font-bold text-green-300">
            The Complete Full-Stack Web Development Bootcamp
          </div>
          <div className="text-sm text-gray-300">January 2024 - April 2024</div>
        </div>
      </div>
    ),
    leadership: (
      <div>
        <div className="mb-4">
          <div className="font-bold text-green-300">Terratech Project Lead</div>
          <div className="text-sm text-gray-300">
            Led development of AI-based agricultural monitoring system
          </div>
          <div className="text-sm mt-1">
            Coordinated IoT implementation, machine learning integration, and
            robotic automation for smart agriculture solution
          </div>
        </div>
        <div className="mb-4">
          <div className="font-bold text-green-300">Technical Innovation</div>
          <div className="text-sm text-gray-300">
            Crypto Price Tracker Development
          </div>
          <div className="text-sm mt-1">
            Architected and developed full-stack cryptocurrency tracking
            application with real-time data visualization
          </div>
        </div>
        <div className="mb-4">
          <div className="font-bold text-green-300">
            AI & Cloud Technologies
          </div>
          <div className="text-sm text-gray-300">IBM SkillsBuild Intern</div>
          <div className="text-sm mt-1">
            Designed agentic AI solutions and automated workflows using IBM
            Cloud and Watson technologies
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

  useEffect(() => {
    const welcomeMessage = (
      <div>
        <div className="text-green-400 text-lg font-bold mb-4">
          Welcome to Debarun's Portfolio Terminal
        </div>
        <div className="mb-2">
          Type 'help' to see available commands or click on the navigation
          above.
        </div>
        <div className="text-sm text-green-300">
          Navigate through my portfolio using terminal commands!
        </div>
      </div>
    );
    setCommands([
      {
        input: "welcome",
        output: welcomeMessage,
        timestamp: new Date(),
      },
    ]);
  }, []);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

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
            <div className="text-green-400">Available commands:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              <div>
                <span className="text-green-400">about</span> - Learn about me
              </div>
              <div>
                <span className="text-green-400">projects</span> - View my
                projects
              </div>
              <div>
                <span className="text-green-400">skills</span> - See my
                technical skills
              </div>
              <div>
                <span className="text-green-400">experience</span> - My work
                experience
              </div>
              <div>
                <span className="text-green-400">contact</span> - How to reach
                me
              </div>
              <div>
                <span className="text-green-400">education</span> - My
                educational background
              </div>
              <div>
                <span className="text-green-400">certifications</span> - View my
                certifications
              </div>
              <div>
                <span className="text-green-400">leadership</span> - Leadership
                and community involvement
              </div>
              <div>
                <span className="text-green-400">clear</span> - Clear the
                terminal
              </div>
            </div>
            <div className="mt-4 text-sm">
              (Psst... there's also a secret command 😉)
            </div>
          </div>
        );
        break;
      case "about":
        output = (
          <div>
            <TypingText
              text="I am a B.Tech graduate in Electronics and Communication Engineering with expertise in full-stack development, cloud computing, and AI technologies."
              speed={100}
            />
            <br />
            <br />
            <TypingText
              text="Proficient in Java, JavaScript, React.js, Next.js, SQL, and Docker, I enjoy creating scalable, intelligent, and user-focused solutions."
              speed={100}
            />
            <br />
            <br />
            <TypingText
              text="With a strong foundation in REST APIs, OOP, Agile methodology, CI/CD, and responsive design, I am eager to contribute to the industry, solve real-world problems, and drive innovation through impactful software development."
              speed={100}
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
          <div className="text-red-500">Permission denied: Nice try! 😉</div>
        );
        break;
      case "chess":
        output = <ChessGame />;
        break;
      case "":
        return;
      default:
        output = (
          <div>
            Command not found: {trimmedInput}. Type 'help' for available
            commands.
          </div>
        );
    }

    setCommands((prev) => [
      ...prev,
      { input: trimmedInput, output, timestamp: new Date() },
    ]);
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
    if (setActiveCommand) setActiveCommand(section);
  };

  useEffect(() => {
    if (activeCommand && activeCommand !== "welcome")
      processCommand(activeCommand);
  }, [activeCommand]);

  return (
    <div className="flex flex-col h-full bg-black text-green-400 font-mono">
      <div
        ref={terminalRef}
        className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-green-800 scrollbar-track-black"
      >
        {commands.map((command, i) => (
          <div key={i} className="mb-4">
            <div className="flex items-center">
              <span className="text-blue-400">debarun@portfolio:~$</span>
              <span className="ml-2">{command.input}</span>
            </div>
            <div className="mt-1 ml-0">{command.output}</div>
          </div>
        ))}
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
                className="absolute top-0 left-0"
                style={{ left: `${currentInput.length * 8}px` }}
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

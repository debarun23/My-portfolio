import React from "react";

const PortfolioContent = {
  about: (
    <div>
      I am a B.Tech graduate in Electronics and Communication Engineering with
      expertise in full-stack development, cloud computing, and AI technologies.
      <br />
      <br />
      Proficient in Java, JavaScript, React.js, Next.js, SQL, and Docker, I
      enjoy creating scalable, intelligent, and user-focused solutions.
      <br />
      <br />
      With a strong foundation in REST APIs, OOP, Agile methodology, CI/CD, and
      responsive design, I am eager to contribute to the industry, solve
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
          Built a React.js single-page application to track real-time prices of
          50+ cryptocurrencies using CoinGecko REST API.
        </div>
        <ul className="list-disc pl-5 text-sm">
          <li>
            Leveraged React Hooks for state management and Google Charts for
            data visualization
          </li>
          <li>
            Migrated build process to Vite, reducing frontend load times by 40%
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
          Git, GitHub, Docker, IBM Cloud, IBM Watson, VS Code, Eclipse, IntelliJ
          IDEA
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
            using large language models, improving candidate preparation by 35%
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
          B.Tech in Electronics and Communication Engineering | CGPA: 7.61/10.0
        </div>
        <div className="text-sm">Aug 2021 – July 2025 | Kolkata, WB</div>
        <div className="text-sm mt-1">
          Relevant Coursework: Data Structures, Software Engineering, APIs,
          Cloud Computing, Communication Systems
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
          IBM Journey to Cloud: Envisioning Your Solution
        </div>
        <div className="text-sm text-gray-300">June 2025 - July 2025</div>
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
        <div className="font-bold text-green-300">AI & Cloud Technologies</div>
        <div className="text-sm text-gray-300">IBM SkillsBuild Intern</div>
        <div className="text-sm mt-1">
          Designed agentic AI solutions and automated workflows using IBM Cloud
          and Watson technologies
        </div>
      </div>
    </div>
  ),
};

export default PortfolioContent;

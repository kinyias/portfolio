export interface SkillCategory {
  id: string;
  label: {
    vi: string;
    en: string;
  };
  text: {
    vi: string;
    en: string;
  };
}

export interface ExperienceItem {
  id: string;
  period: {
    vi: string;
    en: string;
  };
  role: {
    vi: string;
    en: string;
  };
  company?: string;
  description: {
    vi: string;
    en: string;
  };
}

export interface EducationInfo {
  degree: {
    vi: string;
    en: string;
  };
  institution: {
    vi: string;
    en: string;
  };
  period: string;
  honors: {
    vi: string;
    en: string;
  };
  gpa: string;
  formatted: {
    vi: string;
    en: string;
  };
}

export interface CertificateItem {
  id: string;
  title: string;
  shortTitle: string;
  issuer: string;
  recipient: string;
  issueDate: string;
  credentialId: string;
  verifyUrl: string;
  skillsSummary: {
    vi: string;
    en: string;
  };
}

export interface QuickPromptItem {
  id: string;
  label: string;
  prompt: string;
}

export interface ProfileData {
  name: string;
  handle: string;
  email: string;
  github: string;
  linkedin: string;
  welcomeIntro: {
    vi: string;
    en: string;
  };
  overviewTitle: {
    vi: string;
    en: string;
  };
  skills: SkillCategory[];
  experience: ExperienceItem[];
  education: EducationInfo;
  certificates: CertificateItem[];
  quickPrompts: {
    vi: QuickPromptItem[];
    en: QuickPromptItem[];
  };
}

export const PROFILE_DATA: ProfileData = {
  name: "Thái Tín Khang",
  handle: "@kinyias",
  email: "kinyias@gmail.com",
  github: "https://github.com/kinyias",
  linkedin: "https://linkedin.com/in/kinyias",

  welcomeIntro: {
    vi: "Xin chào bạn! 👋 Mình là trợ lý ảo của Thái Tín Khang (@kinyias). Chào mừng bạn đến với portfolio của mình!",
    en: "Hello there! 👋 I am the virtual assistant for Thái Tín Khang (@kinyias). Welcome to my portfolio!",
  },

  overviewTitle: {
    vi: "Thông tin hồ sơ năng lực của Thái Tín Khang:",
    en: "Overview of Thái Tín Khang's profile & background:",
  },

  // Kỹ năng chuyên môn
  skills: [
    {
      id: "languages",
      label: {
        vi: "Ngôn ngữ lập trình:",
        en: "Programming Languages:",
      },
      text: {
        vi: "TypeScript, JavaScript, Python, PHP, SQL.",
        en: "TypeScript, JavaScript, Python, PHP, SQL.",
      },
    },
    {
      id: "frontend",
      label: {
        vi: "Frontend:",
        en: "Frontend:",
      },
      text: {
        vi: "React, Next.js, AngularJS, Astro, Tailwind CSS, Bootstrap, Laravel, Redux, React Query.",
        en: "React, Next.js, AngularJS, Astro, Tailwind CSS, Bootstrap, Laravel, Redux, React Query.",
      },
    },
    {
      id: "backend",
      label: {
        vi: "Backend:",
        en: "Backend:",
      },
      text: {
        vi: "Node.js, Express, NestJS, FastAPI, REST API, FlaskAPI, WebSocket.",
        en: "Node.js, Express, NestJS, FastAPI, REST API, FlaskAPI, WebSocket.",
      },
    },
    {
      id: "databases",
      label: {
        vi: "Cơ sở dữ liệu:",
        en: "Databases:",
      },
      text: {
        vi: "PostgreSQL, MongoDB, MySQL, Firebase.",
        en: "PostgreSQL, MongoDB, MySQL, Firebase.",
      },
    },
    {
      id: "devops",
      label: {
        vi: "DevOps & Cloud:",
        en: "DevOps & Cloud:",
      },
      text: {
        vi: "Docker, GitHub Actions CI/CD, Vercel, Nginx.",
        en: "Docker, GitHub Actions CI/CD, Vercel, Nginx.",
      },
    },
    {
      id: "ai",
      label: {
        vi: "AI & Tự động hóa:",
        en: "AI & Automation:",
      },
      text: {
        vi: "RAG pipelines, embeddings, prompt engineering, Gemini và OpenAI APIs, LangChain, Antigravity, Claude Code, Cursor, OpenClaw, Hermes Agent, n8n.",
        en: "RAG pipelines, embeddings, prompt engineering, Gemini and OpenAI APIs, LangChain, Antigravity, Claude Code, Cursor, OpenClaw, Hermes Agent, n8n.",
      },
    },
    {
      id: "design",
      label: {
        vi: "Thiết kế & Biên tập:",
        en: "Design & Editing:",
      },
      text: {
        vi: "Photoshop, CapCut, Figma, Canva.  AI video/image editing: Google Flow, ChatGPT Image, Midejourney, SD, Seedance, Kling, Hailuo,..",
        en: "Photoshop, CapCut, Figma, Canva. AI video/image editing: Google Flow, ChatGPT Image, Midejourney, SD, Seedance, Kling, Hailuo,...",
      },
    },
    {
      id: "soft_skills",
      label: {
        vi: "Kỹ năng mềm & Ngoại ngữ:",
        en: "Soft Skills & Languages:",
      },
      text: {
        vi: "Làm việc nhóm theo Agile/Scrum, code review, viết tài liệu kỹ thuật.",
        en: "Agile/Scrum teamwork, code review, technical writing.",
      },
    },
  ],

  // Kinh nghiệm làm việc
  experience: [
    {
      id: "current",
      period: {
        vi: "2023 – Hiện tại",
        en: "2023 – Present",
      },
      role: {
        vi: "Software Developer & Tech Content Creator",
        en: "Software Developer & Tech Content Creator",
      },
      description: {
        vi: "Chuyên sâu phát triển web hiện đại, kiến trúc AI & tối ưu hiệu năng cao (Astro 7, React, Next.js, Node.js).",
        en: "Specialized in modern web engineering, AI architecture & 60FPS UI (Astro 7, React, Next.js, Node.js).",
      },
    },
    {
      id: "viethas",
      period: {
        vi: "10/2022 – 08/2023",
        en: "10/2022 – 08/2023",
      },
      role: {
        vi: "Front End Developer tại Viethas",
        en: "Front End Developer at Viethas",
      },
      company: "Viethas",
      description: {
        vi: "Phát triển website Angular, thiết kế & hoàn thiện UI/UX, đề xuất cải tiến sản phẩm, vận hành ổn định hệ thống.",
        en: "Angular web development, UI/UX implementation, product improvement initiatives & system stability.",
      },
    },
  ],

  // Học vấn và bằng cấp
  education: {
    degree: {
      vi: "Kỹ sư Công nghệ Thông tin",
      en: "Bachelor of Information Technology (Engineer Degree)",
    },
    institution: {
      vi: "ĐẠI HỌC CÔNG NGHỆ SÀI GÒN (STU)",
      en: "SAIGON TECHNOLOGY UNIVERSITY (STU)",
    },
    period: "2021 – 2025",
    honors: {
      vi: "Tốt nghiệp loại Giỏi",
      en: "Graduated with Distinction",
    },
    gpa: "3.3 / 4.0",
    formatted: {
      vi: "Kỹ sư Công nghệ Thông tin, ĐẠI HỌC CÔNG NGHỆ SÀI GÒN (STU), tốt nghiệp loại Giỏi, GPA: 3.3/4.0",
      en: "Bachelor of Information Technology (Engineer Degree), SAIGON TECHNOLOGY UNIVERSITY (STU), Graduated with Distinction, GPA: 3.3/4.0",
    },
  },

  // Chứng chỉ Google Professional
  certificates: [
    {
      id: "cert-google-ux",
      title: "Chứng chỉ: Google UX Design Professional Certificate",
      shortTitle: "Google UX Design Professional",
      issuer: "Google (Coursera)",
      recipient: "Thái Tín Khang (Thai Tin Khang)",
      issueDate: "21/07/2024",
      credentialId: "69UM78L9WB8U",
      verifyUrl: "https://www.coursera.org/account/accomplishments/specialization/69UM78L9WB8U",
      skillsSummary: {
        vi: "Quy trình thiết kế UX (7 khóa học), nghiên cứu người dùng, wireframe & mockup, Figma interactive prototype, usability testing.",
        en: "Complete 7-course Google UX Design specialization: user research, wireframing & prototyping in Figma, and usability testing.",
      },
    },
    {
      id: "cert-google-python",
      title: "Chứng chỉ: Google IT Automation with Python Professional Certificate",
      shortTitle: "Google IT Automation with Python",
      issuer: "Google (Coursera)",
      recipient: "Thái Tín Khang (Thai Tin Khang)",
      issueDate: "12/07/2024",
      credentialId: "6MHAKX6MT9SJ",
      verifyUrl: "https://www.coursera.org/account/accomplishments/specialization/6MHAKX6MT9SJ",
      skillsSummary: {
        vi: "Tự động hóa hệ thống với Python (6 khóa học), Git & GitHub, kỹ thuật troubleshooting & debugging, quản lý cấu hình và Cloud.",
        en: "IT Automation with Python (6 courses): system automation, Git & GitHub, troubleshooting & debugging, configuration management and Cloud.",
      },
    },
    {
      id: "cert-google-it-support",
      title: "Chứng chỉ: Google IT Support Professional Certificate",
      shortTitle: "Google IT Support Professional",
      issuer: "Google (Coursera)",
      recipient: "Thái Tín Khang (Thai Tin Khang)",
      issueDate: "25/06/2024",
      credentialId: "3BBZWEEHYWB2",
      verifyUrl: "https://www.coursera.org/account/accomplishments/specialization/3BBZWEEHYWB2",
      skillsSummary: {
        vi: "Hỗ trợ kỹ thuật CNTT (5 khóa học), mạng máy tính (DNS, TCP/IP), hệ điều hành Windows & Linux, an ninh mạng & quản trị hệ thống.",
        en: "IT Technical Support (5 courses): computer networking (DNS, TCP/IP), Windows & Linux OS, system administration and cybersecurity.",
      },
    },
  ],

  // Nút câu hỏi gợi ý nhanh (Quick Prompts)
  quickPrompts: {
    vi: [
      {
        id: "projects",
        label: "🚀 Dự án nổi bật",
        prompt: "Cho mình xem các dự án tiêu biểu của bạn",
      },
      {
        id: "certs",
        label: "📜 Chứng chỉ Google",
        prompt: "Cho mình biết chi tiết các chứng chỉ Google của bạn",
      },
      {
        id: "stack",
        label: "🛠️ Kỹ nghệ & Tech Stack",
        prompt: "Tech stack và kỹ năng chuyên môn của bạn gồm những gì?",
      },
      {
        id: "edu",
        label: "🎓 Học vấn & STU",
        prompt: "Cho mình biết thông tin về học vấn và bằng cấp của bạn",
      },
      {
        id: "contact",
        label: "🤝 Hợp tác & Liên hệ",
        prompt: "Làm sao để liên hệ hợp tác làm dự án với bạn?",
      },
      {
        id: "performance",
        label: "⚡ Tối ưu hiệu năng GSAP",
        prompt: "Bạn tối ưu animation GSAP và 60fps như thế nào?",
      },
      {
        id: "joke",
        label: "😄 Kể chuyện cười dev",
        prompt: "Kể cho mình nghe một mẩu chuyện cười lập trình",
      },
    ],
    en: [
      {
        id: "projects",
        label: "🚀 Featured Projects",
        prompt: "Show me your signature projects and works",
      },
      {
        id: "certs",
        label: "📜 Google Certifications",
        prompt: "Tell me about your Google Professional Certifications",
      },
      {
        id: "stack",
        label: "🛠️ Core Tech Stack",
        prompt: "What technologies and frameworks do you specialize in?",
      },
      {
        id: "edu",
        label: "🎓 Education & Degree",
        prompt: "Tell me about your education, degree, and university background",
      },
      {
        id: "contact",
        label: "🤝 Collaboration & Hire",
        prompt: "How can we work together or get in touch?",
      },
      {
        id: "performance",
        label: "⚡ 60FPS GSAP Secrets",
        prompt: "How do you optimize GSAP animations for ultra performance?",
      },
      {
        id: "joke",
        label: "😄 Tell a Dev Joke",
        prompt: "Tell me a funny developer joke",
      },
    ],
  },
};

// Re-export CERTIFICATES_DATA for backward compatibility
export const CERTIFICATES_DATA = PROFILE_DATA.certificates;


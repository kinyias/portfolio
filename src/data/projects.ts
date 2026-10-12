import type { ImageMetadata } from 'astro';
import nexusImg from '../assets/images/projects/nexus-os.jpg';
import spatialImg from '../assets/images/projects/spatial-3d.jpg';
import hyperflowImg from '../assets/images/projects/hyperflow.jpg';
import aiAgentImg from '../assets/images/projects/ai-orchestrator.jpg';
import zenithImg from '../assets/images/projects/zenith-audio.jpg';
import tkhangFashionImg from '../assets/images/projects/tkhang-fashion.png';

export interface ProjectItem {
  id: string;
  num: string;
  title: string;
  category: string;
  year: string;
  tagline: { en: string; vi: string };
  description: { en: string; vi: string };
  image: ImageMetadata;
  tags: string[];
  metrics: string;
  demoUrl: string;
  githubUrl: string;
  highlights: {
    en: string[];
    vi: string[];
  };
}

export const projectsData: ProjectItem[] = [
  {
    id: 'nexus-os',
    num: '01',
    title: 'Nexus Studio OS',
    category: 'Developer Platform',
    year: '2026',
    tagline: {
      en: 'High-Performance Cloud Developer Workspace & Graph Diagnostics',
      vi: 'Môi trường lập trình đám mây hiệu năng cao & Chẩn đoán đồ thị'
    },
    description: {
      en: 'An ultra-fast cloud IDE built with WebAssembly kernels and Monaco editor. Features visual node microservice topology, live code coverage diagnostics, and distributed build streaming.',
      vi: 'Môi trường phát triển trên nền web tối ưu hóa bởi lõi WebAssembly và Monaco editor. Tích hợp trực quan hóa cấu trúc vi dịch vụ, chẩn đoán độ phủ mã nguồn và streaming tiến trình build.'
    },
    image: nexusImg,
    tags: ['Next.js', 'Rust WASM', 'Monaco', 'TailwindCSS', 'WebSocket'],
    metrics: '98.4% Code Coverage • Sub-5ms Terminal',
    demoUrl: 'https://github.com/kinyias',
    githubUrl: 'https://github.com/kinyias',
    highlights: {
      en: [
        'WASM-compiled language server protocol engine running client-side',
        'Interactive real-time node topology map with dynamic SVG routing',
        'Multi-pane terminal emulator with zero input latency'
      ],
      vi: [
        'Lõi Language Server Protocol biên dịch sang WASM chạy trực tiếp trên client',
        'Sơ đồ topo vi dịch vụ tương tác thời gian thực với định tuyến đường nối SVG',
        'Giả lập terminal đa màn hình với độ trễ nhập liệu gần như bằng không'
      ]
    }
  },
  {
    id: 'studio-nova-3d',
    num: '02',
    title: 'Studio Nova 3D',
    category: 'WebGL & Spatial Experience',
    year: '2025',
    tagline: {
      en: 'Interactive WebGL Spatial Experience & Polyhedral Shaders',
      vi: 'Trải nghiệm không gian 3D tương tác & Shader đa diện khúc xạ'
    },
    description: {
      en: 'A high-concept 3D digital art exhibition created with Three.js and custom GLSL chromatic dispersion shaders. Features physics-driven floating polyhedrons reacting to pointer gravity and GSAP ScrollTrigger.',
      vi: 'Triển lãm nghệ thuật số 3D ý niệm phát triển bằng Three.js và shader khúc xạ tán sắc ánh sáng GLSL. Các khối đa diện lơ lửng phản hồi trọng lực con trỏ và đồng bộ mượt mà cùng GSAP ScrollTrigger.'
    },
    image: spatialImg,
    tags: ['Three.js', 'GLSL Shaders', 'GSAP ScrollTrigger', 'Astro', 'WebGL'],
    metrics: 'Solid 60 FPS • Real-time PBR Caustics',
    demoUrl: 'https://github.com/kinyias',
    githubUrl: 'https://github.com/kinyias',
    highlights: {
      en: [
        'Custom chromatic dispersion glass shader with internal light bouncing',
        'Rigid-body inertia physics coupled with GSAP scroll timeline',
        'Adaptive device GPU tier detection with automatic LOD downscaling'
      ],
      vi: [
        'Shader thủy tinh tán sắc quang phổ tùy chỉnh với phản xạ ánh sáng nội khối',
        'Vật lý quán tính liên kết trực tiếp với dòng thời gian cuộn GSAP',
        'Tự động nhận diện cấp độ GPU thiết bị để điều chỉnh mức độ chi tiết LOD'
      ]
    }
  },
  {
    id: 'hyperflow',
    num: '03',
    title: 'Apex HyperFlow',
    category: 'Fintech & Streaming',
    year: '2025',
    tagline: {
      en: 'Real-time Distributed Metrics Engine & High-Density Ledger',
      vi: 'Công cụ giám sát phân tán thời gian thực & Sổ lệnh thị trường mật độ cao'
    },
    description: {
      en: 'Ultra-low-latency financial dashboard visualizing continuous tick-level market order books, imbalance order flow, and telemetry metrics rendered through canvas-accelerated charts.',
      vi: 'Bảng điều khiển tài chính độ trễ siêu thấp trực quan hóa sổ lệnh thị trường theo thời gian thực, mất cân bằng dòng lệnh và chỉ số đo lường hiệu năng đồ họa canvas.'
    },
    image: hyperflowImg,
    tags: ['TypeScript', 'WebSocket', 'Canvas API', 'TailwindCSS', 'GSAP Core'],
    metrics: '9.5k msgs/sec • 0.84ms Latency',
    demoUrl: 'https://github.com/kinyias',
    githubUrl: 'https://github.com/kinyias',
    highlights: {
      en: [
        'Dual-buffered Canvas renderer avoiding DOM layout thrashing',
        'Binary WebSocket framing with Protobuf decompression',
        'Interactive micro-sparklines with GSAP tween interpolation'
      ],
      vi: [
        'Cơ chế vẽ Canvas bộ đệm đôi loại bỏ hiện tượng giật giật DOM',
        'Đóng gói WebSocket nhị phân kết hợp giải nén Protobuf',
        'Đồ thị micro-sparkline tương tác mượt mà với nội suy GSAP'
      ]
    }
  },
  {
    id: 'ai-orchestrator',
    num: '04',
    title: 'Aurora Multi-Agent AI',
    category: 'Agentic AI Platform',
    year: '2026',
    tagline: {
      en: 'Autonomous Agent Orchestration Canvas & Visual Graph Automation',
      vi: 'Không gian điều phối AI tự hành & Đồ thị trực quan hóa quy trình'
    },
    description: {
      en: 'Next-generation canvas orchestrator enabling collaborative AI agents to perform automated git monitoring, security auditing, unit test generation, and seamless production deployments.',
      vi: 'Giao diện điều phối thế hệ mới cho phép các tác tử AI cộng tác tự động giám sát mã nguồn, kiểm tra an ninh, viết kiểm thử tự động và triển khai sản phẩm an toàn.'
    },
    image: aiAgentImg,
    tags: ['React', 'LangChain', 'GSAP Timeline', 'FastAPI', 'TailwindCSS'],
    metrics: '14 Active Agents • Parallel Orchestration',
    demoUrl: 'https://github.com/kinyias',
    githubUrl: 'https://github.com/kinyias',
    highlights: {
      en: [
        'Self-healing pipeline execution with visual step fallback graphs',
        'Dynamic Bezier glow wires connecting active communicating agents',
        'Sub-second telemetry logging with semantic log filtering'
      ],
      vi: [
        'Khả năng tự phục hồi pipeline khi gặp lỗi với biểu đồ nhánh dự phòng',
        'Dây liên kết Bezier phát sáng phản ánh lưu lượng dữ liệu trao đổi giữa tác tử',
        'Nhật ký vi mô thời gian thực với bộ lọc ngữ nghĩa thông minh'
      ]
    }
  },
  {
    id: 'zenith-audio',
    num: '05',
    title: 'AetherWeb Synthesizer',
    category: 'Creative Audio DSP',
    year: '2024',
    tagline: {
      en: 'Browser-Native Web Audio Workstation & Harmonic Spectral Visualizer',
      vi: 'Trạm làm việc âm thanh kỹ thuật số trên web & Phân tích phổ tần'
    },
    description: {
      en: 'A professional in-browser synthesizer running custom AudioWorklet polyphonic subtractive synthesis engines, harmonic spectral FFT analyzers, and tactile brushed aluminum control dials.',
      vi: 'Trình tổng hợp âm thanh chuyên nghiệp chạy trực tiếp trên trình duyệt với lõi AudioWorklet tổng hợp trừ đa âm, phân tích phổ tần FFT thời gian thực và núm xoay kim loại chân thực.'
    },
    image: zenithImg,
    tags: ['Web Audio API', 'AudioWorklet', 'Canvas 2D', 'GSAP', 'TypeScript'],
    metrics: 'Zero-Jitter Buffer • 24-bit 96kHz DSP',
    demoUrl: 'https://github.com/kinyias',
    githubUrl: 'https://github.com/kinyias',
    highlights: {
      en: [
        'AudioWorklet thread isolation preventing audio dropouts under UI load',
        'Interactive holographic frequency visualizer rendered at 60 FPS',
        'WebMIDI API integration supporting hardware MIDI controllers'
      ],
      vi: [
        'Tách biệt luồng AudioWorklet giúp âm thanh không ngắt quãng khi tải giao diện nặng',
        'Biểu đồ phổ tần holographic tương tác trực quan 60 FPS',
        'Tích hợp chuẩn WebMIDI kết nối bộ điều khiển phần cứng ngoài'
      ]
    }
  },
  {
    id: 'tkhang-fashion',
    num: '06',
    title: 'TKhang - Men Fashion',
    category: 'E-Commerce & AI Platform',
    year: '2025',
    tagline: {
      en: 'Modern Men\'s Fashion E-Commerce Platform Powered by Next.js 15 & Gemini AI',
      vi: 'Nền tảng Thương mại Điện tử Thời trang Nam Hiện đại với Next.js 15 & Gemini AI'
    },
    description: {
      en: 'A modern, full-featured men\'s fashion e-commerce platform built with Next.js 15 App Router, PostgreSQL, and Gemini AI. Features smart full-text synonym search, multi-gateway payments (COD, VNPay, MoMo), automated size suggestions, and an intelligent analytics admin dashboard.',
      vi: 'Website thương mại điện tử chuyên bán thời trang nam được xây dựng bằng Next.js 15 App Router, PostgreSQL và Gemini AI. Cung cấp tìm kiếm ngữ nghĩa theo từ đồng nghĩa, thanh toán đa cổng (COD, VNPay, MoMo), AI gợi ý chọn size và trang quản trị phân tích số liệu.'
    },
    image: tkhangFashionImg,
    tags: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Gemini AI', 'Zustand', 'Shadcn/ui'],
    metrics: 'Next.js 15 App Router • Gemini AI • Multi-Payment',
    demoUrl: 'https://tkhang-fashion.vercel.app/',
    githubUrl: 'https://github.com/kinyias/Men-Fashion',
    highlights: {
      en: [
        'Generative AI features: Automated product descriptions, intelligent size recommendation, review moderation, and customer support chatbot',
        'Smart search & filtering: High-speed full-text search, synonym query expansion, and faceted filters (price, size, color, brand)',
        'Omnichannel payments & logistics: Integrated COD, VNPay, and MoMo with automated ViettelPost shipping rates calculation',
        'Decoupled scalable architecture: Next.js 15 App Router SSR/SSG coupled with dedicated REST API backend'
      ],
      vi: [
        'Ứng dụng AI thông minh: Tự động tạo mô tả sản phẩm bằng Gemini, gợi ý chọn size, duyệt đánh giá tự động và chatbot hỗ trợ',
        'Tìm kiếm & bộ lọc thông minh: Tìm kiếm full-text search, hỗ trợ từ đồng nghĩa cùng bộ lọc đa chiều (giá, size, màu sắc, thương hiệu)',
        'Thanh toán đa cổng & vận chuyển: Tích hợp COD, VNPay, MoMo kết hợp tính phí giao hàng tự động với ViettelPost',
        'Kiến trúc tối ưu hiệu năng: SSR/SSG với Next.js 15 App Router kết hợp backend API riêng biệt'
      ]
    }
  }
];

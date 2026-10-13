/**
 * Turso (libSQL) + Prisma ORM Portfolio Blog API Client
 * Supports multilingual querying (VI & EN), search, pagination, tags & categories.
 */

export interface BlogCategory {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  postCount?: number;
}

export interface BlogTag {
  id?: string;
  name: string;
  slug: string;
  postCount?: number;
}

export interface BlogAlternate {
  id?: string;
  slug: string;
  title: string;
  lang: 'vi' | 'en';
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  featured: boolean;
  published: boolean;
  publishedAt: string | null;
  readingTime: number;
  views?: number;
  authorName: string;
  lang: 'vi' | 'en';
  translationKey: string | null;
  category?: BlogCategory | null;
  tags?: BlogTag[];
  alternate?: BlogAlternate | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface BlogListResponse {
  success: boolean;
  data: BlogPost[];
  pagination: PaginationMeta;
}

export interface FetchBlogListParams {
  lang?: 'vi' | 'en' | 'all';
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  tag?: string;
  featured?: boolean;
  sort?: 'latest' | 'oldest' | 'views';
}

/**
 * Returns normalized base API URL from environment variable or default
 */
export function getApiBaseUrl(): string {
  const envUrl = import.meta.env.PUBLIC_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/+$/, '');
  }
  return 'http://localhost:3000';
}

/**
 * Curated Fallback Posts matching the seed data in Turso / Prisma
 * Guarantees zero-blank UI even if the backend daemon is temporarily sleeping.
 */
export const FALLBACK_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-seed-rag-vi',
    slug: 'xay-dung-rag-chatbot-portfolio-voi-gemini-va-pinecone',
    title: 'Xây dựng RAG Chatbot Portfolio thông minh với Gemini 2.5 và Pinecone',
    excerpt: 'Hướng dẫn chi tiết từng bước xây dựng chatbot RAG tích hợp mô hình Gemini 2.5 Flash, cơ sở dữ liệu vector Pinecone, và truyền phát phản hồi thời gian thực qua Server-Sent Events (SSE).',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    published: true,
    publishedAt: '2026-10-12T07:29:04.000Z',
    readingTime: 6,
    views: 187,
    authorName: 'Thái Tín Khang',
    lang: 'vi',
    translationKey: 'rag-chatbot-portfolio',
    category: {
      id: 'cat-ai',
      name: 'AI & Machine Learning',
      slug: 'ai-machine-learning',
    },
    tags: [
      { id: 'tag-gemini', name: 'Gemini', slug: 'gemini' },
      { id: 'tag-rag', name: 'RAG', slug: 'rag' },
      { id: 'tag-nodejs', name: 'Node.js', slug: 'nodejs' },
    ],
    alternate: {
      id: 'post-seed-rag-en',
      slug: 'building-rag-chatbot-portfolio-with-gemini-and-pinecone',
      title: 'Building an Intelligent RAG Chatbot Portfolio with Gemini 2.5 and Pinecone',
      lang: 'en',
    },
    content: `# Xây dựng RAG Chatbot Portfolio thông minh với Gemini 2.5 và Pinecone

Trong thời đại AI bùng nổ, một trang Portfolio thông thường chỉ liệt kê danh sách dự án tĩnh đã không còn tạo đủ ấn tượng mạnh mẽ với nhà tuyển dụng và đối tác công nghệ.

Bài viết này chia sẻ kiến trúc và giải pháp thực chiến mà tôi đã áp dụng: **Tích hợp Chatbot RAG (Retrieval-Augmented Generation)** tương tác trực tiếp, có khả năng tra cứu hồ sơ cá nhân và trả lời thông minh dựa trên ngữ cảnh thực tế.

---

## 1. Tổng Quan Kiến Trúc RAG

Mô hình RAG khắc phục nhược điểm "ảo giác" (hallucination) của LLM bằng cách cung cấp dữ liệu thực tế từ kho lưu trữ vector:

\`\`\`
[Người Dùng Hỏi] 
       ↓
[Tạo Embedding Câu Hỏi (Google Text-Embedding-004)]
       ↓
[Tìm Kiếm Vector Gần Nhất Trên Pinecone Serverless]
       ↓
[Tổng Hợp Ngữ Cảnh + Lời Nhắc Hệ Thống (System Prompt)]
       ↓
[Gemini 2.5 Sinh Phản Hồi] 
       ↓
[Stream SSE Về Trình Duyệt Theo Thời Gian Thực]
\`\`\`

---

## 2. Thiết Lập Pinecone Vector Database

Pinecone Serverless mang lại độ trễ cực thấp và chi phí tối ưu:

\`\`\`typescript
import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const index = pc.index('portfolio-knowledge');
\`\`\`

---

## 3. Stream Server-Sent Events (SSE) với Express

Thay vì để người dùng chờ đợi toàn bộ câu trả lời, SSE truyền tải từng token chữ mượt mà ngay khi mô hình sinh ra:

\`\`\`javascript
app.post('/api/chat', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const stream = await geminiModel.generateContentStream({
    contents: promptWithContext,
  });

  for await (const chunk of stream) {
    const text = chunk.text();
    res.write(\`event: token\\ndata: \${JSON.stringify({ text })}\\n\\n\`);
  }

  res.write('event: done\\ndata: {}\\n\\n');
  res.end();
});
\`\`\`

---

## 4. Trải Nghiệm Người Dùng (UX) với GSAP & Kinetic UI

Giao diện chat được tối ưu hóa với:
- **GSAP ScrollTrigger**: Tự động cuộn theo nhịp gõ chữ của AI.
- **Web Audio API**: Âm thanh pop phản hồi tactile khi tin nhắn được gửi đi.
- **Glassmorphism Theme**: Tương thích hoàn hảo cả chế độ Sáng và Tối.

Kết quả là một trải nghiệm portfolio tương tác sống động, giúp người xem trò chuyện trực tiếp để tìm hiểu kỹ năng, dự án và phong cách lập trình của tác giả!`,
  },
  {
    id: 'post-seed-rag-en',
    slug: 'building-rag-chatbot-portfolio-with-gemini-and-pinecone',
    title: 'Building an Intelligent RAG Chatbot Portfolio with Gemini 2.5 and Pinecone',
    excerpt: 'A comprehensive step-by-step engineering guide on constructing an interactive RAG chatbot powered by Gemini 2.5 Flash, Pinecone serverless vector database, and real-time Server-Sent Events (SSE).',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    published: true,
    publishedAt: '2026-10-12T07:29:04.000Z',
    readingTime: 6,
    views: 187,
    authorName: 'Thái Tín Khang',
    lang: 'en',
    translationKey: 'rag-chatbot-portfolio',
    category: {
      id: 'cat-ai',
      name: 'AI & Machine Learning',
      slug: 'ai-machine-learning',
    },
    tags: [
      { id: 'tag-gemini', name: 'Gemini', slug: 'gemini' },
      { id: 'tag-rag', name: 'RAG', slug: 'rag' },
      { id: 'tag-nodejs', name: 'Node.js', slug: 'nodejs' },
    ],
    alternate: {
      id: 'post-seed-rag-vi',
      slug: 'xay-dung-rag-chatbot-portfolio-voi-gemini-va-pinecone',
      title: 'Xây dựng RAG Chatbot Portfolio thông minh với Gemini 2.5 và Pinecone',
      lang: 'vi',
    },
    content: `# Building an Intelligent RAG Chatbot Portfolio with Gemini 2.5 and Pinecone

In the modern landscape of AI-driven engineering, a traditional static developer portfolio no longer captures the full depth of a software engineer's capabilities.

This case study breaks down the architecture and implementation of an **interactive RAG (Retrieval-Augmented Generation) portfolio chatbot** designed to contextualize my background, technical stack, and software projects in real-time.

---

## 1. System Architecture

The RAG workflow resolves LLM hallucinations by grounding conversations in indexed documentation:

\`\`\`
[User Query]
       ↓
[Generate Vector Embedding via text-embedding-004]
       ↓
[Similarity Search on Pinecone Serverless Index]
       ↓
[Context Ingestion & System Prompt Formulation]
       ↓
[Gemini 2.5 Flash Streaming Inference]
       ↓
[Real-Time Server-Sent Events (SSE) to Frontend]
\`\`\`

---

## 2. Serverless Vector Indexing with Pinecone

Pinecone Serverless provides sub-10ms similarity queries with zero cold-start penalty:

\`\`\`typescript
import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const index = pc.index('portfolio-knowledge');
\`\`\`

---

## 3. Streaming Responses via Server-Sent Events

Instead of buffering the entire completion, SSE streams discrete tokens as they are inferred:

\`\`\`javascript
app.post('/api/chat', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const stream = await geminiModel.generateContentStream({
    contents: promptWithContext,
  });

  for await (const chunk of stream) {
    const text = chunk.text();
    res.write(\`event: token\\ndata: \${JSON.stringify({ text })}\\n\\n\`);
  }

  res.write('event: done\\ndata: {}\\n\\n');
  res.end();
});
\`\`\`

---

## 4. Frontend Polish & Kinetic Motion

Key UX considerations implemented in this portfolio:
- **GSAP ScrollTrigger**: Auto-aligns conversation flow as new tokens populate.
- **Web Audio API Synthesizer**: Subtle frequency ramps for tactile auditory feedback.
- **Theme Resilience**: Seamless zero-FOUC support across light and dark modes.`,
  },
  {
    id: 'post-seed-turso-vi',
    slug: 'toi-uu-database-edge-voi-turso-libsql-va-prisma',
    title: 'Tối ưu cơ sở dữ liệu trên Edge với Turso libSQL và Prisma ORM',
    excerpt: 'Tại sao SQLite phân tán (libSQL) kết hợp cùng Prisma 7 là lựa chọn hoàn hảo cho các ứng dụng web hiện đại: độ trễ <5ms trên toàn cầu, chi phí 0đ và tính sẵn sàng cao.',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    published: true,
    publishedAt: '2026-10-11T14:15:00.000Z',
    readingTime: 5,
    views: 142,
    authorName: 'Thái Tín Khang',
    lang: 'vi',
    translationKey: 'turso-libsql-prisma',
    category: {
      id: 'cat-db',
      name: 'Database & Cloud',
      slug: 'database-cloud',
    },
    tags: [
      { id: 'tag-turso', name: 'Turso', slug: 'turso' },
      { id: 'tag-prisma', name: 'Prisma', slug: 'prisma' },
      { id: 'tag-sqlite', name: 'SQLite', slug: 'sqlite' },
    ],
    alternate: {
      id: 'post-seed-turso-en',
      slug: 'optimizing-edge-database-with-turso-libsql-and-prisma',
      title: 'Optimizing Edge Databases with Turso libSQL and Prisma ORM',
      lang: 'en',
    },
    content: `# Tối ưu cơ sở dữ liệu trên Edge với Turso libSQL và Prisma ORM

Khi xây dựng các ứng dụng web toàn cầu hoặc các trang portfolio cá nhân cần phản hồi tức thì, việc đặt cơ sở dữ liệu quan hệ truyền thống (như PostgreSQL hoặc MySQL) tại một vùng duy nhất thường gây ra độ trễ mạng lớn (150ms - 300ms) cho người dùng ở xa.

**Turso (dựa trên libSQL)** giải quyết triệt để vấn đề này bằng cách cho phép nhân bản (replication) SQLite đến hàng chục địa điểm Edge trên toàn thế giới với chi phí gần như bằng không.

---

## 1. Tại Sao Chọn Turso libSQL?

- **Tốc độ đọc cục bộ**: Dữ liệu được đọc từ vị trí gần người dùng nhất (như Sinapore hoặc Tokyo), chỉ mất 1ms - 5ms.
- **Tương thích hoàn toàn với Prisma ORM**: Thông qua adapter \`@prisma/adapter-libsql\`.
- **Dự phòng cục bộ dễ dàng**: Trong môi trường local development, bạn có thể chạy file SQLite \`dev.db\` mà không cần kết nối mạng.

---

## 2. Cấu hình Prisma với libSQL Adapter

\`\`\`prisma
datasource db {
  provider = "sqlite"
}

generator client {
  provider = "prisma-client-js"
}
\`\`\`

Trong file khởi tạo Prisma Client:

\`\`\`typescript
import { createClient } from '@libsql/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { PrismaClient } from '@prisma/client';

const libsql = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:./dev.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const adapter = new PrismaLibSQL(libsql);
export const prisma = new PrismaClient({ adapter });
\`\`\`

---

## 3. Kiến Trúc Bài Viết Đa Ngôn Ngữ Tối Giản

Thay vì tạo các bảng phức tạp nối quan hệ n-n cho từng ngôn ngữ dịch, chúng tôi sử dụng trường \`lang\` ('vi' | 'en') và \`translationKey\`:

- Mỗi ngôn ngữ là một bản ghi độc lập có URL slug thân thiện riêng (hỗ trợ SEO tối đa).
- Khi người đọc xem bản tiếng Việt, API tự động truy vấn bài viết mang cùng \`translationKey\` ở ngôn ngữ đối ứng và trả về \`alternate\`.

Điều này mang lại sự linh hoạt tối đa cho cả người viết lẫn giao diện đọc tin!`,
  },
  {
    id: 'post-seed-turso-en',
    slug: 'optimizing-edge-database-with-turso-libsql-and-prisma',
    title: 'Optimizing Edge Databases with Turso libSQL and Prisma ORM',
    excerpt: 'Why distributed SQLite (libSQL) combined with Prisma 7 is the ultimate edge architecture: sub-5ms global reads, zero server maintenance, and flawless developer experience.',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    published: true,
    publishedAt: '2026-10-11T14:15:00.000Z',
    readingTime: 5,
    views: 142,
    authorName: 'Thái Tín Khang',
    lang: 'en',
    translationKey: 'turso-libsql-prisma',
    category: {
      id: 'cat-db',
      name: 'Database & Cloud',
      slug: 'database-cloud',
    },
    tags: [
      { id: 'tag-turso', name: 'Turso', slug: 'turso' },
      { id: 'tag-prisma', name: 'Prisma', slug: 'prisma' },
      { id: 'tag-sqlite', name: 'SQLite', slug: 'sqlite' },
    ],
    alternate: {
      id: 'post-seed-turso-vi',
      slug: 'toi-uu-database-edge-voi-turso-libsql-va-prisma',
      title: 'Tối ưu cơ sở dữ liệu trên Edge với Turso libSQL và Prisma ORM',
      lang: 'vi',
    },
    content: `# Optimizing Edge Databases with Turso libSQL and Prisma ORM

When engineering high-performance web platforms, co-locating compute and data at the Edge is essential. Traditional monolithic SQL instances introduce latency bottlenecks across continents.

**Turso (powered by libSQL)** provides globally replicated SQLite instances with zero cold start and instant local read queries.

---

## 1. Key Architectural Advantages

- **Sub-5ms Global Reads**: Queries hit regional edge replicas (e.g. Tokyo, Singapore, Frankfurt).
- **Prisma 7 Native Adapter**: Direct integration via \`@prisma/adapter-libsql\`.
- **Hybrid Local Fallback**: Seamless fallback to local file-based \`dev.db\` during offline development.

---

## 2. Adapter Setup

\`\`\`typescript
import { createClient } from '@libsql/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { PrismaClient } from '@prisma/client';

const libsql = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:./dev.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const adapter = new PrismaLibSQL(libsql);
export const prisma = new PrismaClient({ adapter });
\`\`\`

---

## 3. Clean Multilingual Data Modeling

Instead of convoluted junction tables for i18n copy, each post specifies its \`lang\` ('en' | 'vi') and shares a common \`translationKey\`. The API dynamically delivers the \`alternate\` payload for instant, frictionless client-side language switching.`,
  },
  {
    id: 'post-seed-motion-vi',
    slug: 'nghe-thuat-tao-chuyen-dong-web-chuyen-nghiep-voi-gsap',
    title: 'Nghệ thuật tạo chuyển động web chuyên nghiệp với GSAP và Canvas',
    excerpt: 'Khám phá bí quyết tạo nên các giao diện web mượt mà đạt chuẩn Awwwards: tối ưu hóa FPS, xử lý ma sát quán tính lerp, và tạo hiệu ứng nhũ ma trận nhị phân tương tác proximity.',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    published: true,
    publishedAt: '2026-10-09T09:30:00.000Z',
    readingTime: 7,
    views: 215,
    authorName: 'Thái Tín Khang',
    lang: 'vi',
    translationKey: 'gsap-creative-motion',
    category: {
      id: 'cat-frontend',
      name: 'Frontend Engineering',
      slug: 'frontend-engineering',
    },
    tags: [
      { id: 'tag-gsap', name: 'GSAP', slug: 'gsap' },
      { id: 'tag-canvas', name: 'Canvas 2D', slug: 'canvas' },
      { id: 'tag-animation', name: 'Creative Tech', slug: 'animation' },
    ],
    alternate: {
      id: 'post-seed-motion-en',
      slug: 'crafting-high-end-web-motion-with-gsap-and-canvas',
      title: 'Crafting High-End Web Motion with GSAP and Canvas',
      lang: 'en',
    },
    content: `# Nghệ thuật tạo chuyển động web chuyên nghiệp với GSAP và Canvas

Sự khác biệt giữa một trang web bình thường và một sản phẩm số đẳng cấp quốc tế thường nằm ở **cảm giác chuyển động (feel of motion)**.

Trong dự án portfolio này, tôi đã xây dựng hệ thống nền ma trận nhị phân (Binary Wave Background) và băng chuyền dự án vô tận lấy cảm hứng từ các nhà thiết kế hàng đầu thế giới.

---

## 1. Nguyên Lý Quán Tính (Linear Interpolation - LERP)

Để con trỏ chuột hoặc thanh cuộn tạo cảm giác êm ái như chất lỏng, công thức Lerp là chìa khóa:

\`\`\`javascript
currentPosition += (targetPosition - currentPosition) * easeFactor;
\`\`\`

Với \`easeFactor\` nằm trong khoảng \`0.05\` đến \`0.1\`, chuyển động sẽ có độ trễ quán tính tự nhiên, xóa bỏ cảm giác giật cục thô cứng của các sự kiện cuộn mặc định.

---

## 2. Tối Ưu Hóa 60 FPS với Hardware Acceleration

- **Chỉ thay đổi Transform và Opacity**: Tuyệt đối không animate các thuộc tính kích hoạt layout reflow như \`top\`, \`left\`, \`width\`.
- **Batching với RequestAnimationFrame**: Đồng bộ hóa toàn bộ tính toán vào chu kỳ vẽ khung hình của GPU.
- **Tôn trọng \`prefers-reduced-motion\`**: Tự động tắt các hiệu ứng mạnh khi người dùng kích hoạt cài đặt giảm chuyển động để bảo vệ thị giác.`,
  },
  {
    id: 'post-seed-motion-en',
    slug: 'crafting-high-end-web-motion-with-gsap-and-canvas',
    title: 'Crafting High-End Web Motion with GSAP and Canvas',
    excerpt: 'Unlocking agency-tier web animations: GPU acceleration, lerp momentum physics, and interactive proximity-based canvas particle blooms.',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    published: true,
    publishedAt: '2026-10-09T09:30:00.000Z',
    readingTime: 7,
    views: 215,
    authorName: 'Thái Tín Khang',
    lang: 'en',
    translationKey: 'gsap-creative-motion',
    category: {
      id: 'cat-frontend',
      name: 'Frontend Engineering',
      slug: 'frontend-engineering',
    },
    tags: [
      { id: 'tag-gsap', name: 'GSAP', slug: 'gsap' },
      { id: 'tag-canvas', name: 'Canvas 2D', slug: 'canvas' },
      { id: 'tag-animation', name: 'Creative Tech', slug: 'animation' },
    ],
    alternate: {
      id: 'post-seed-motion-vi',
      slug: 'nghe-thuat-tao-chuyen-dong-web-chuyen-nghiep-voi-gsap',
      title: 'Nghệ thuật tạo chuyển động web chuyên nghiệp với GSAP và Canvas',
      lang: 'vi',
    },
    content: `# Crafting High-End Web Motion with GSAP and Canvas

The defining quality that separates a boilerplate developer portfolio from an award-winning digital experience is the **tactile rhythm of motion**.

---

## 1. Lerp Momentum Physics

Fluid interactive scroll relies on continuous linear interpolation:

\`\`\`javascript
currentPosition += (targetPosition - currentPosition) * easeFactor;
\`\`\`

Calibrating \`easeFactor\` between \`0.06\` and \`0.09\` introduces weighted physical momentum that feels responsive and organic under finger or cursor control.

---

## 2. Strict 60-120 FPS Performance Guardrails

- Confining animations exclusively to composite-only CSS properties (\`transform\`, \`opacity\`).
- Offloading heavy particle coordinates to 2D Canvas buffers rather than bloated DOM trees.
- Honoring the \`prefers-reduced-motion\` media query to support accessible navigation.`,
  },
];

/**
 * Fetches blog posts from Turso / Express backend with robust fallbacks
 */
export async function fetchBlogPosts(params: FetchBlogListParams = {}): Promise<BlogListResponse> {
  const {
    lang = 'en',
    page = 1,
    limit = 9,
    search = '',
    category = '',
    tag = '',
    featured,
    sort = 'latest',
  } = params;

  const baseUrl = getApiBaseUrl();
  const query = new URLSearchParams();

  if (lang) query.set('lang', lang);
  query.set('page', String(page));
  query.set('limit', String(limit));
  if (search.trim()) query.set('search', search.trim());
  if (category.trim()) query.set('category', category.trim());
  if (tag.trim()) query.set('tag', tag.trim());
  if (typeof featured === 'boolean') query.set('featured', String(featured));
  if (sort) query.set('sort', sort);

  try {
    const url = `${baseUrl}/api/blogs?${query.toString()}`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(3500),
      headers: { Accept: 'application/json' },
    });

    if (res.ok) {
      const json = await res.json();
      if (json && json.success && Array.isArray(json.data)) {
        return json as BlogListResponse;
      }
    }
  } catch (_err) {
    // Backend offline / unreachable, apply local fallback filter
  }

  // Local fallback filtering
  let filtered = [...FALLBACK_BLOG_POSTS];

  if (lang !== 'all') {
    filtered = filtered.filter((p) => p.lang === lang);
  }

  if (search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.excerpt && p.excerpt.toLowerCase().includes(q)) ||
        p.content.toLowerCase().includes(q)
    );
  }

  if (category.trim()) {
    filtered = filtered.filter((p) => p.category?.slug === category.trim());
  }

  if (tag.trim()) {
    filtered = filtered.filter((p) => p.tags?.some((t) => t.slug === tag.trim()));
  }

  if (typeof featured === 'boolean') {
    filtered = filtered.filter((p) => p.featured === featured);
  }

  if (sort === 'oldest') {
    filtered.sort((a, b) => new Date(a.publishedAt || 0).getTime() - new Date(b.publishedAt || 0).getTime());
  } else if (sort === 'views') {
    filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
  } else {
    // latest
    filtered.sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime());
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginatedData = filtered.slice(startIndex, startIndex + limit);

  return {
    success: true,
    data: paginatedData,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

/**
 * Fetches a single blog post by slug
 */
export async function fetchBlogPostBySlug(
  slug: string,
  view: boolean = true
): Promise<BlogPost | null> {
  const baseUrl = getApiBaseUrl();

  try {
    const url = `${baseUrl}/api/blogs/${encodeURIComponent(slug)}?view=${view}`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(3500),
      headers: { Accept: 'application/json' },
    });

    if (res.ok) {
      const json = await res.json();
      if (json && json.success && json.data) {
        return json.data as BlogPost;
      }
    }
  } catch (_err) {
    // fallback
  }

  // Fallback lookup
  const match = FALLBACK_BLOG_POSTS.find((p) => p.slug === slug);
  if (match) {
    return {
      ...match,
      views: match.views !== undefined ? (view ? match.views + 1 : match.views) : undefined,
    };
  }

  return null;
}

/**
 * Fetches featured blog posts
 */
export async function fetchFeaturedPosts(lang: 'vi' | 'en' = 'en', limit: number = 3): Promise<BlogPost[]> {
  const baseUrl = getApiBaseUrl();

  try {
    const url = `${baseUrl}/api/blogs/featured?lang=${lang}&limit=${limit}`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(3000),
      headers: { Accept: 'application/json' },
    });

    if (res.ok) {
      const json = await res.json();
      if (json && json.success && Array.isArray(json.data)) {
        return json.data as BlogPost[];
      }
    }
  } catch (_err) {
    // fallback
  }

  return FALLBACK_BLOG_POSTS.filter((p) => p.lang === lang && p.featured).slice(0, limit);
}

/**
 * Fetches list of categories with post counts
 */
export async function fetchBlogCategories(lang?: 'vi' | 'en'): Promise<BlogCategory[]> {
  const baseUrl = getApiBaseUrl();

  try {
    const query = lang ? `?lang=${lang}` : '';
    const res = await fetch(`${baseUrl}/api/blogs/categories${query}`, {
      signal: AbortSignal.timeout(3000),
      headers: { Accept: 'application/json' },
    });

    if (res.ok) {
      const json = await res.json();
      if (json && json.success && Array.isArray(json.data)) {
        return json.data as BlogCategory[];
      }
    }
  } catch (_err) {
    // fallback
  }

  // Fallback categories
  const categoriesMap = new Map<string, BlogCategory>();
  const posts = lang ? FALLBACK_BLOG_POSTS.filter((p) => p.lang === lang) : FALLBACK_BLOG_POSTS;

  for (const post of posts) {
    if (post.category) {
      const existing = categoriesMap.get(post.category.slug);
      if (existing) {
        existing.postCount = (existing.postCount || 0) + 1;
      } else {
        categoriesMap.set(post.category.slug, {
          ...post.category,
          postCount: 1,
        });
      }
    }
  }

  return Array.from(categoriesMap.values());
}

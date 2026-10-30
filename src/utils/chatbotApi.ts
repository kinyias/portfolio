/**
 * Client-side integration for Portfolio Chatbot (Express + Gemini + Pinecone RAG)
 * Endpoint: /api/chat (SSE streaming)
 */

import { PROFILE_DATA } from '../data/profile';
const CERTIFICATES_DATA = PROFILE_DATA.certificates;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface MetaPayload {
  model?: string;
  sources?: string[];
}

export interface StreamChatOptions {
  apiUrl: string;
  messages: ChatMessage[];
  signal?: AbortSignal;
  onToken: (token: string) => void;
  onMeta?: (meta: MetaPayload) => void;
  onDone?: () => void;
  onError?: (errorMessage: string) => void;
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function renderMarkdown(raw: string): string {
  if (!raw) return '';

  let html = raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Multi-line code blocks: ```lang ... ```
  html = html.replace(/```([\s\S]*?)```/g, (_m, code) => {
    return `<pre class="my-2 p-2.5 rounded-lg bg-slate-900 text-slate-100 dark:bg-black/90 font-mono text-xs overflow-x-auto"><code>${code.trim()}</code></pre>`;
  });

  // Inline code: `code`
  html = html.replace(
    /`([^`]+)`/g,
    '<code class="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono text-[12px] text-blue-600 dark:text-blue-400">$1</code>'
  );

  // Bold: **text**
  html = html.replace(
    /\*\*([^*]+)\*\*/g,
    '<strong class="font-semibold text-slate-900 dark:text-white">$1</strong>'
  );

  // Italic: *text*
  html = html.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');

  // Links: [text](url)
  html = html.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 underline font-medium hover:text-blue-500 inline-flex items-center gap-0.5">$1 ↗</a>'
  );

  // Bullet lists (- or *) and numbered lists (1. 2.)
  const lines = html.split('\n');
  const blocks: string[] = [];
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;
  let currentParagraph: string[] = [];

  function flushParagraph() {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join('<br />').trim();
      if (text) {
        blocks.push(`<p class="leading-relaxed">${text}</p>`);
      }
      currentParagraph = [];
    }
  }

  function flushList() {
    if (currentList) {
      const tag = currentList.type;
      const listClass =
        tag === 'ul'
          ? 'my-2 space-y-1.5 pl-4 list-disc text-slate-700 dark:text-slate-300'
          : 'my-2 space-y-1.5 pl-4 list-decimal text-slate-700 dark:text-slate-300';
      const itemsHtml = currentList.items
        .map((it) => `<li class="leading-relaxed">${it}</li>`)
        .join('');
      blocks.push(`<${tag} class="${listClass}">${itemsHtml}</${tag}>`);
      currentList = null;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    // Numbered list: 1. Item
    const olMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (olMatch) {
      flushParagraph();
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(olMatch[2]);
      continue;
    }

    // Bullet list: - or *
    const ulMatch = line.match(/^[-*]\s+(.+)$/);
    if (ulMatch) {
      flushParagraph();
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(ulMatch[1]);
      continue;
    }

    // Normal text
    flushList();
    currentParagraph.push(line);
  }

  flushParagraph();
  flushList();

  return blocks.length > 0 ? blocks.join('') : `<p>${html}</p>`;
}

/**
 * Generate intelligent offline fallback responses when the Express / Pinecone backend is unavailable
 */
function getOfflineFallbackReply(userText: string): string {
  const lower = userText.toLowerCase();
  const isVi = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(userText) ||
    lower.includes('chứng chỉ') ||
    lower.includes('bạn') ||
    lower.includes('kinh nghiệm') ||
    lower.includes('dự án') ||
    lower.includes('liên hệ');

  // 1. Certificates query
  if (
    lower.includes('chứng chỉ') ||
    lower.includes('chung chi') ||
    lower.includes('cert') ||
    lower.includes('ux') ||
    lower.includes('python') ||
    lower.includes('coursera') ||
    lower.includes('it support') ||
    lower.includes('google')
  ) {
    if (isVi) {
      const certList = CERTIFICATES_DATA.map((c, idx) => {
        return `${idx + 1}. **${c.shortTitle}** (Cấp ${c.issueDate})\n   - **Mã chứng chỉ (Credential ID):** \`${c.credentialId}\`\n   - **Đơn vị cấp:** ${c.issuer}\n   - **Xác minh trực tuyến:** [Xác thực chứng chỉ Coursera ↗](${c.verifyUrl})\n   - **Nội dung:** ${c.skillsSummary.vi}`;
      }).join('\n\n');

      return `Thái Tín Khang sở hữu **3 chứng chỉ chuyên nghiệp** do **Google** chứng nhận trên nền tảng Coursera:\n\n${certList}\n\nTất cả chứng chỉ đều có mã định danh và đường dẫn xác thực trực tiếp trên hệ thống Coursera.`;
    } else {
      const certList = CERTIFICATES_DATA.map((c, idx) => {
        return `${idx + 1}. **${c.shortTitle}** (Issued ${c.issueDate})\n   - **Credential ID:** \`${c.credentialId}\`\n   - **Issuer:** ${c.issuer}\n   - **Verification:** [Verify credential on Coursera ↗](${c.verifyUrl})\n   - **Skills:** ${c.skillsSummary.en}`;
      }).join('\n\n');

      return `Thái Tín Khang holds **3 Google Professional Certificates** verified on Coursera:\n\n${certList}\n\nAll credentials feature unique IDs and live verification links on Coursera.`;
    }
  }

  // 2. Tech stack & Skills query
  if (
    lower.includes('skill') ||
    lower.includes('kỹ năng') ||
    lower.includes('ky nang') ||
    lower.includes('stack') ||
    lower.includes('công nghệ') ||
    lower.includes('cong nghe') ||
    lower.includes('kỹ nghệ') ||
    lower.includes('tech') ||
    lower.includes('frontend') ||
    lower.includes('backend') ||
    lower.includes('database') ||
    lower.includes('devops')
  ) {
    if (isVi) {
      const skillsLines = PROFILE_DATA.skills.map((s) => `- **${s.label.vi}** ${s.text.vi}`).join('\n');
      return `**Kỹ năng chuyên môn của ${PROFILE_DATA.name}:**\n${skillsLines}`;
    } else {
      const skillsLines = PROFILE_DATA.skills.map((s) => `- **${s.label.en}** ${s.text.en}`).join('\n');
      return `**Technical & Professional Skills of ${PROFILE_DATA.name}:**\n${skillsLines}`;
    }
  }

  // 3. Education & Degree query
  if (
    lower.includes('học vấn') ||
    lower.includes('hoc van') ||
    lower.includes('đại học') ||
    lower.includes('dai hoc') ||
    lower.includes('bằng cấp') ||
    lower.includes('bang cap') ||
    lower.includes('stu') ||
    lower.includes('sài gòn') ||
    lower.includes('sai gon') ||
    lower.includes('education') ||
    lower.includes('degree') ||
    lower.includes('university') ||
    lower.includes('gpa')
  ) {
    return isVi
      ? `**Học vấn và Bằng cấp của ${PROFILE_DATA.name}:**\n- **Học vị & Bằng cấp:** ${PROFILE_DATA.education.degree.vi}\n- **Trường đào tạo:** ${PROFILE_DATA.education.institution.vi}\n- **Thời gian khóa học:** ${PROFILE_DATA.education.period}\n- **Xếp loại tốt nghiệp:** ${PROFILE_DATA.education.honors.vi}\n- **Điểm trung bình tích lũy (GPA):** **${PROFILE_DATA.education.gpa}**`
      : `**Education & Degree of ${PROFILE_DATA.name}:**\n- **Degree:** ${PROFILE_DATA.education.degree.en}\n- **Institution:** ${PROFILE_DATA.education.institution.en}\n- **Period:** ${PROFILE_DATA.education.period}\n- **Honors:** ${PROFILE_DATA.education.honors.en}\n- **Cumulative GPA:** **${PROFILE_DATA.education.gpa}**`;
  }

  // 4. Experience query
  if (
    lower.includes('kinh nghiệm') ||
    lower.includes('kinh nghiem') ||
    lower.includes('viethas') ||
    lower.includes('làm việc') ||
    lower.includes('lam viec') ||
    lower.includes('công tác') ||
    lower.includes('experience') ||
    lower.includes('career')
  ) {
    if (isVi) {
      const expLines = PROFILE_DATA.experience.map((exp, idx) => {
        const cleanDesc = exp.description.vi.replace(/\n● /g, '\n   - ').replace(/● /g, '- ');
        return `${idx + 1}. **${exp.role.vi}${exp.company ? ` tại ${exp.company}` : ''}** (${exp.period.vi})\n   ${cleanDesc}`;
      }).join('\n');
      return `**Kinh nghiệm làm việc của ${PROFILE_DATA.name}:**\n${expLines}`;
    } else {
      const expLines = PROFILE_DATA.experience.map((exp, idx) => {
        const cleanDesc = exp.description.en.replace(/\n● /g, '\n   - ').replace(/● /g, '- ');
        return `${idx + 1}. **${exp.role.en}${exp.company ? ` at ${exp.company}` : ''}** (${exp.period.en})\n   ${cleanDesc}`;
      }).join('\n');
      return `**Professional Experience of ${PROFILE_DATA.name}:**\n${expLines}`;
    }
  }

  // 3. Contact query
  if (lower.includes('liên hệ') || lower.includes('contact') || lower.includes('email') || lower.includes('hợp tác') || lower.includes('hire')) {
    return isVi
      ? `Bạn có thể liên hệ trực tiếp với ${PROFILE_DATA.name} qua:\n- ✉️ **Email:** [${PROFILE_DATA.email}](mailto:${PROFILE_DATA.email})\n- 🐙 **GitHub:** [${PROFILE_DATA.github.replace('https://', '')}](${PROFILE_DATA.github})\n- 💼 **LinkedIn:** [${PROFILE_DATA.linkedin.replace('https://', '')}](${PROFILE_DATA.linkedin})\nThời gian phản hồi thông thường trong vòng 24 giờ làm việc.`
      : `You can connect directly with ${PROFILE_DATA.name} via:\n- ✉️ **Email:** [${PROFILE_DATA.email}](mailto:${PROFILE_DATA.email})\n- 🐙 **GitHub:** [${PROFILE_DATA.github.replace('https://', '')}](${PROFILE_DATA.github})\n- 💼 **LinkedIn:** [${PROFILE_DATA.linkedin.replace('https://', '')}](${PROFILE_DATA.linkedin})\nUsual response turnaround is within 24 hours.`;
  }

  // 4. Projects query
  if (lower.includes('dự án') || lower.includes('project') || lower.includes('tiêu biểu')) {
    return isVi
      ? `Một số dự án tiêu biểu của Thái Tín Khang:\n- **DocuMind:** Ứng dụng hỏi đáp tài liệu bằng AI đa ngôn ngữ (RAG pipeline, Express, Gemini API, Pinecone, SSE Streaming).\n- **ShopHub:** Nền tảng sàn thương mại điện tử đa người bán (Next.js, NestJS, PostgreSQL, Redis, WebSocket).\n- **DevPulse:** Công cụ mã nguồn mở CLI & Dashboard tối ưu chu kỳ review code GitHub (TypeScript, SQLite, React).`
      : `Signature projects by Thái Tín Khang:\n- **DocuMind:** AI document Q&A application supporting multilingual RAG (Express, Gemini API, Pinecone, SSE streaming).\n- **ShopHub:** Multi-vendor marketplace platform (Next.js, NestJS, PostgreSQL, Redis, WebSocket).\n- **DevPulse:** Open-source CLI & Dashboard tracking GitHub PR cycles and code review bottlenecks.`;
  }

  // Default fallback
  return isVi
    ? `Chào bạn! Mình là trợ lý ảo của Thái Tín Khang. Bạn có thể hỏi mình về **Kỹ năng chuyên môn**, **Học vấn & Bằng cấp (Đại học Công nghệ Sài Gòn - STU)**, **Kinh nghiệm làm việc**, **3 chứng chỉ Google Professional**, **Dự án nổi bật**, hoặc **Hợp tác & Liên hệ** (kinyias@gmail.com).`
    : `Hello! I am Thái Tín Khang's virtual assistant. Feel free to ask about his **Skills & Tech Stack**, **Education & Degree (Saigon Technology University - STU)**, **Work Experience**, **3 Google Professional Certificates**, **Featured Projects**, or **Collaboration & Contact** (kinyias@gmail.com).`;
}

/**
 * Simulate SSE stream delivery for offline responses
 */
async function simulateStreamTokens(
  text: string,
  onToken: (token: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const words = text.split(/(\s+)/);
  for (const word of words) {
    if (signal?.aborted) return;
    onToken(word);
    await new Promise((r) => setTimeout(r, 16));
  }
}

/**
 * Streams chat responses from /api/chat using Server-Sent Events (SSE)
 * With seamless intelligent offline fallback if the API server is unreachable.
 */
export async function streamChat(options: StreamChatOptions): Promise<void> {
  const { apiUrl, messages, signal, onToken, onMeta, onDone, onError } = options;

  let hasFinished = false;
  const finish = () => {
    if (hasFinished) return;
    hasFinished = true;
    onDone?.();
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
      signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const msg = errorData.error || errorData.message || `Lỗi máy chủ (${response.status})`;
      throw new Error(msg);
    }

    if (!response.body) {
      throw new Error('ReadableStream không được trình duyệt hỗ trợ.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      let boundaryIndex: number;

      // Xử lý các khối message phân tách bởi \n\n
      while ((boundaryIndex = buffer.indexOf('\n\n')) >= 0) {
        const rawEvent = buffer.slice(0, boundaryIndex);
        buffer = buffer.slice(boundaryIndex + 2);

        let eventType = 'message';
        let eventData = '';

        for (const line of rawEvent.split('\n')) {
          const trimmedLine = line.replace(/\r$/, '');
          if (trimmedLine.startsWith('event:')) {
            eventType = trimmedLine.slice(6).trim();
          } else if (trimmedLine.startsWith('data:')) {
            eventData += trimmedLine.slice(5).trim();
          }
        }

        if (!eventData) continue;

        try {
          const parsed = JSON.parse(eventData);
          if (eventType === 'token' && typeof parsed.text === 'string') {
            onToken(parsed.text);
          } else if (eventType === 'meta') {
            onMeta?.(parsed);
          } else if (eventType === 'done') {
            finish();
          } else if (eventType === 'error') {
            throw new Error(parsed.message || 'Lỗi xử lý luồng AI từ server.');
          }
        } catch (err: any) {
          if (eventType === 'error') throw err;
          // Bỏ qua dòng parse rỗng hoặc JSON format dở dang
        }
      }
    }

    finish();
  } catch (err: any) {
    if (err.name === 'AbortError') return;

    const isNetworkErr = err instanceof TypeError || err.message?.includes('Failed to fetch');
    if (isNetworkErr) {
      // Graceful offline fallback with full certificate and profile knowledge
      const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
      const fallbackText = getOfflineFallbackReply(lastUserMsg);

      onMeta?.({ model: 'offline-assistant', sources: ['certificates.ts', 'profile.json'] });
      await simulateStreamTokens(fallbackText, onToken, signal);
      finish();
      return;
    }

    onError?.(err.message || 'Có lỗi xảy ra trong quá trình phản hồi.');
  }
}

/**
 * Client-side integration for Portfolio Chatbot (Express + Gemini + Pinecone RAG)
 * Endpoint: /api/chat (SSE streaming)
 */

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

  // Bullet lists (- or *)
  const lines = html.split('\n');
  let inList = false;
  const processed: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const bulletMatch = line.match(/^(\s*)[-*]\s+(.+)$/);
    if (bulletMatch) {
      if (!inList) {
        inList = true;
        processed.push('<ul class="my-1.5 space-y-1 pl-4 list-disc text-slate-700 dark:text-slate-300">');
      }
      processed.push(`<li>${bulletMatch[2]}</li>`);
    } else {
      if (inList) {
        inList = false;
        processed.push('</ul>');
      }
      processed.push(line);
    }
  }
  if (inList) {
    processed.push('</ul>');
  }

  html = processed.join('\n');
  html = html.replace(/\n\n+/g, '</p><p class="mt-2">');
  html = html.replace(/\n/g, '<br />');

  return `<p>${html}</p>`;
}

/**
 * Streams chat responses from /api/chat using Server-Sent Events (SSE)
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
    const displayMsg = isNetworkErr
      ? `Không thể kết nối đến máy chủ Chatbot (${apiUrl}). Vui lòng kiểm tra server Express / Node.js đã được khởi động chưa.`
      : (err.message || 'Có lỗi xảy ra trong quá trình phản hồi.');

    onError?.(displayMsg);
  }
}

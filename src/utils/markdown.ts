import { Marked } from 'marked';

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface RenderedArticle {
  html: string;
  toc: TocItem[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove Vietnamese diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

/**
 * Transforms raw markdown into semantic, high-end HTML with TOC extraction
 */
export function renderArticleMarkdown(raw: string): RenderedArticle {
  if (!raw) return { html: '', toc: [] };

  const toc: TocItem[] = [];
  const markedInstance = new Marked();

  markedInstance.use({
    renderer: {
      heading({ depth, text }) {
        // Strip any HTML tags from raw heading text for clean TOC and ID
        const cleanText = text.replace(/<[^>]+>/g, '');
        const id = slugify(cleanText) || `heading-${toc.length + 1}`;

        if (depth === 2 || depth === 3) {
          toc.push({ id, text: cleanText, level: depth });
        }

        const anchor = `<a href="#${id}" class="heading-anchor opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-blue-500 font-normal select-none" aria-label="Link to section">#</a>`;

        return `<h${depth} id="${id}" class="group scroll-mt-24 font-bold text-slate-900 dark:text-white ${
          depth === 2
            ? 'text-2xl sm:text-3xl mt-12 mb-5 pb-2.5 border-b border-black/5 dark:border-white/10 tracking-tight'
            : 'text-xl sm:text-2xl mt-8 mb-4 tracking-tight'
        }"><span>${cleanText}</span>${anchor}</h${depth}>`;
      },
      code({ text, lang }) {
        const language = (lang || 'text').toLowerCase();
        const encoded = encodeURIComponent(text);

        return `<div class="code-block-wrapper relative my-6 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-slate-950 shadow-lg text-slate-100 group">
          <div class="code-block-header flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-white/10 text-xs font-mono text-slate-400">
            <span class="flex items-center gap-2">
              <span class="inline-block w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
              <span class="inline-block w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
              <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
              <span class="ml-1 uppercase tracking-wider font-semibold text-slate-300">${language}</span>
            </span>
            <button 
              type="button" 
              class="copy-code-btn px-2.5 py-1 rounded-md text-[11px] font-sans font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/15 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              data-code="${encoded}"
              aria-label="Copy code to clipboard"
            >
              <svg class="copy-icon w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span class="copy-label">Copy</span>
            </button>
          </div>
          <pre class="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed bg-transparent"><code class="language-${language}">${text}</code></pre>
        </div>`;
      },
    },
    gfm: true,
    breaks: true,
  });

  const html = markedInstance.parse(raw) as string;
  return { html, toc };
}

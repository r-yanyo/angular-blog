import { Injectable } from '@angular/core';
import hljs from 'highlight.js';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {
  constructor() {
    marked.use(markedHighlight({
      langPrefix: 'hljs language-',
      highlight(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
          return hljs.highlight(code, { language: lang }).value;
        }
        return hljs.highlightAuto(code).value;
      }
    }));
  }

  parse(markdown: string): string | Promise<string> {
    return marked.parse(markdown);
  }
}

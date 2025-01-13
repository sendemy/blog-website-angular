import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

@Injectable({
  providedIn: 'root',
})
export class MarkdownService {
  constructor(private sanitizer: DomSanitizer) {}

  convertMarkdownToHtml(markdown: string): SafeHtml {
    const html = marked(markdown);
    return this.sanitizer.bypassSecurityTrustHtml(html as string);
  }
}

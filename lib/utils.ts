import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatContent(content: string): string {
  // If content is already HTML, return as is
  if (content.includes('<p>') || content.includes('<br>') || content.includes('<div>')) {
    return content;
  }

  // Split by double line breaks for paragraphs
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim());

  // Wrap each paragraph in <p> tags
  const formatted = paragraphs
    .map(p => `<p class="mb-4 text-muted-foreground leading-relaxed">${p.trim()}</p>`)
    .join('');

  return formatted;
}
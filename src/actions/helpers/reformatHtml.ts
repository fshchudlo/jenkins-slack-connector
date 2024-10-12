export function reformatHtml(html: string): string {
    if (!html) return html;

    return html
        .replace(/<br\/?>/g, "\n")
        .replace(/<a\s+href="([^"]+)"[^>]*>(.*?)<\/a>/gi, (_match, url, title) => `<${url}|${title}>`);
}
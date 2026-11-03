export class Solution {
    entityParser(text: string): string {
        const entities: Record<string, string> = {
            '&quot;': '"',
            '&apos;': "'",
            '&gt;': '>',
            '&lt;': '<',
            '&frasl;': '/',
            '&amp;': '&',
        };
        return text.replace(/&quot;|&apos;|&gt;|&lt;|&frasl;|&amp;/g, (m) => entities[m]);
    }
}

export class Solution {
    fullJustify(words: string[], maxWidth: number): string[] {
        const lines: string[] = [];
        let start = 0;
        while (start < words.length) {
            let end = start + 1;
            let length = words[start].length;
            while (end < words.length && length + 1 + words[end].length <= maxWidth) {
                length += 1 + words[end].length;
                end++;
            }
            const count = end - start;
            let line = "";
            if (count === 1) {
                line = words[start] + " ".repeat(maxWidth - length);
            } else if (end === words.length) {
                line = words.slice(start, end).join(" ");
                line += " ".repeat(maxWidth - length);
            } else {
                const gaps = count - 1;
                const spaces = maxWidth - (length - gaps);
                const base = Math.floor(spaces / gaps);
                const extra = spaces % gaps;
                for (let index = start; index < end; index++) {
                    line += words[index];
                    if (index < end - 1) {
                        const wide = index - start < extra ? 1 : 0;
                        line += " ".repeat(base + wide);
                    }
                }
            }
            lines.push(line);
            start = end;
        }
        return lines;
    }
}

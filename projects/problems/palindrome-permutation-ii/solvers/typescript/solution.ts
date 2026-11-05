export class Solution {
    generatePalindromes(s: string): string[] {
        const out: string[] = [];
        const chars: string[] = [];
        const counts: number[] = [];
        for (const ch of s) {
            const at = chars.indexOf(ch);
            if (at < 0) {
                chars.push(ch);
                counts.push(1);
            } else {
                counts[at] += 1;
            }
        }

        let middle = "";
        let middleCount = 0;
        for (let i = 0; i < chars.length; i++) {
            if (counts[i] % 2 === 1) {
                middleCount += 1;
                middle = chars[i];
                counts[i] -= 1;
            }
        }
        if (middleCount > 1) {
            return out;
        }

        const expand = (current: string): void => {
            if (current.length === s.length) {
                out.push(current);
                return;
            }
            for (let i = 0; i < chars.length; i++) {
                if (counts[i] >= 2) {
                    counts[i] -= 2;
                    expand(chars[i] + current + chars[i]);
                    counts[i] += 2;
                }
            }
        };
        expand(middle);
        return out;
    }
}

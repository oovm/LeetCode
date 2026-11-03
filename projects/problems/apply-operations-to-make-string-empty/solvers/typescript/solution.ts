export class Solution {
    lastNonEmptyString(s: string): string {
        const counts = new Array<number>(26).fill(0);
        for (const ch of s) counts[ch.charCodeAt(0) - 97] += 1;
        const maxFreq = Math.max(...counts);
        const out: string[] = [];
        for (let i = s.length - 1; i >= 0; i--) {
            const c = s.charCodeAt(i) - 97;
            if (counts[c] === maxFreq && !out.includes(s[i])) {
                out.unshift(s[i]);
                counts[c] = 0;
            }
        }
        return out.join('');
    }
}

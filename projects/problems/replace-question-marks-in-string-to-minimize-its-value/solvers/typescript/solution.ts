export class Solution {
    minimizeStringValue(s: string): string {
        const counts = new Array<number>(26).fill(0);
        for (const ch of s) {
            if (ch !== '?') counts[ch.charCodeAt(0) - 97] += 1;
        }
        const fills: string[] = [];
        for (const ch of s) {
            if (ch === '?') {
                let best = 0;
                for (let i = 1; i < 26; i++) {
                    if (counts[i] < counts[best]) best = i;
                }
                fills.push(String.fromCharCode(97 + best));
                counts[best] += 1;
            }
        }
        fills.sort();
        const out = s.split('');
        let i = 0;
        for (let j = 0; j < out.length; j++) {
            if (out[j] === '?') {
                out[j] = fills[i];
                i += 1;
            }
        }
        return out.join('');
    }
}

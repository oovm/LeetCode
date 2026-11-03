export class Solution {
    uniqueLetterString(s: string): number {
        const last = new Array<number>(26).fill(-1);
        const prev = new Array<number>(26).fill(-1);
        let total = 0;
        for (let i = 0; i < s.length; i++) {
            const c = s.charCodeAt(i) - 97;
            total += (i - last[c]) * (last[c] - prev[c]);
            prev[c] = last[c];
            last[c] = i;
        }
        for (let c = 0; c < 26; c++) {
            total += (s.length - last[c]) * (last[c] - prev[c]);
        }
        return total;
    }
}

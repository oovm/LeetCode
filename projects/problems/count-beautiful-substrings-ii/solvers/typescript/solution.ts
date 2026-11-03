export class Solution {
    beautifulSubstrings(s: string, k: number): number {
        let period = k;
        for (let v = 1; v <= k; v++) {
            if ((v * v) % k === 0) {
                period = v;
                break;
            }
        }
        const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
        const counts = new Map<string, number>([[`0,${0}`, 1]]);
        let diff = 0;
        let total = 0;
        for (let i = 0; i < s.length; i++) {
            diff += vowels.has(s[i]) ? 1 : -1;
            const key = `${diff},${(i + 1) % period}`;
            total += counts.get(key) ?? 0;
            counts.set(key, (counts.get(key) ?? 0) + 1);
        }
        return total;
    }
}

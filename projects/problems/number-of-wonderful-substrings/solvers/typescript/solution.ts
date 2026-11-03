export class Solution {
    wonderfulSubstrings(word: string): number {
        const counts = new Array<number>(1024).fill(0);
        counts[0] = 1;
        let mask = 0;
        let total = 0;
        for (const ch of word) {
            mask ^= 1 << (ch.charCodeAt(0) - 97);
            total += counts[mask];
            for (let i = 0; i < 10; i++) {
                total += counts[mask ^ (1 << i)];
            }
            counts[mask] += 1;
        }
        return total;
    }
}

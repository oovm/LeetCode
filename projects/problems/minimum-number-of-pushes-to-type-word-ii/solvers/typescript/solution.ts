export class Solution {
    minimumPushes(word: string): number {
        const counts = new Array<number>(26).fill(0);
        for (const ch of word) {
            counts[ch.charCodeAt(0) - 97] += 1;
        }
        counts.sort((a, b) => b - a);
        let total = 0;
        counts.forEach((c, i) => {
            total += c * (Math.floor(i / 8) + 1);
        });
        return total;
    }
}

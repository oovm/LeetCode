export class Solution {
    minimumKeypresses(s: string): number {
        const counts = new Array<number>(26).fill(0);
        for (const ch of s) {
            counts[ch.charCodeAt(0) - 97] += 1;
        }
        counts.sort((a, b) => b - a);
        let total = 0;
        counts.forEach((c, i) => {
            total += c * (Math.floor(i / 9) + 1);
        });
        return total;
    }
}

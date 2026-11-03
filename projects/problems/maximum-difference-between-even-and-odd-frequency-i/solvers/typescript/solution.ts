export class Solution {
    maxDifference(s: string): number {
        const counts = new Array<number>(26).fill(0);
        for (const ch of s) {
            counts[ch.charCodeAt(0) - 97] += 1;
        }
        let maxOdd = 0;
        let minEven = Infinity;
        for (const c of counts) {
            if (c === 0) continue;
            if (c % 2 === 1) maxOdd = Math.max(maxOdd, c);
            else minEven = Math.min(minEven, c);
        }
        return maxOdd - minEven;
    }
}

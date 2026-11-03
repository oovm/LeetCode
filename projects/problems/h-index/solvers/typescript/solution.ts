export class Solution {
    hIndex(citations: number[]): number {
        const n = citations.length;
        const bucket = new Array<number>(n + 1).fill(0);
        for (const c of citations) bucket[Math.min(c, n)]++;
        let count = 0;
        for (let h = n; h >= 0; h--) {
            count += bucket[h];
            if (count >= h) return h;
        }
        return 0;
    }
}

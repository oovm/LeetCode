export class Solution {
    maxProduct(s: string): number {
        const n = s.length;
        const pal: boolean[][] = Array.from({ length: n }, () => new Array<boolean>(n).fill(false));
        for (let i = n - 1; i >= 0; i--) {
            for (let j = i; j < n; j++) {
                pal[i][j] = s[i] === s[j] && (j - i < 2 || pal[i + 1][j - 1]);
            }
        }
        const leftBest = new Array<number>(n).fill(0);
        const rightBest = new Array<number>(n).fill(0);
        for (let j = 0; j < n; j++) {
            leftBest[j] = j > 0 ? leftBest[j - 1] : 0;
            for (let i = 0; i <= j; i++) {
                if (pal[i][j]) leftBest[j] = Math.max(leftBest[j], j - i + 1);
            }
        }
        for (let i = n - 1; i >= 0; i--) {
            rightBest[i] = i + 1 < n ? rightBest[i + 1] : 0;
            for (let j = i; j < n; j++) {
                if (pal[i][j]) rightBest[i] = Math.max(rightBest[i], j - i + 1);
            }
        }
        let best = 0;
        for (let i = 0; i + 1 < n; i++) {
            best = Math.max(best, leftBest[i] * rightBest[i + 1]);
        }
        return best;
    }
}

export class Solution {
    largestOverlap(img1: number[][], img2: number[][]): number {
        const n = img1.length;
        const rows1: number[] = [];
        const cols1: number[] = [];
        const rows2: number[] = [];
        const cols2: number[] = [];
        for (let row = 0; row < n; row++) {
            for (let col = 0; col < img1[row].length; col++) {
                if (img1[row][col] === 1) {
                    rows1.push(row);
                    cols1.push(col);
                }
                if (img2[row][col] === 1) {
                    rows2.push(row);
                    cols2.push(col);
                }
            }
        }
        const width = n * 2 + 1;
        const counts = new Map<number, number>();
        let best = 0;
        for (let a = 0; a < rows1.length; a++) {
            for (let b = 0; b < rows2.length; b++) {
                const key = (rows1[a] - rows2[b] + n) * width + (cols1[a] - cols2[b] + n);
                const streak = (counts.get(key) ?? 0) + 1;
                counts.set(key, streak);
                if (streak > best) {
                    best = streak;
                }
            }
        }
        return best;
    }
}

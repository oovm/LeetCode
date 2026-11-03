export class Solution {
    imageSmoother(img: number[][]): number[][] {
        const m = img.length;
        const n = img[0].length;
        const out: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                let sum = 0;
                let count = 0;
                for (let di = -1; di <= 1; di++) {
                    for (let dj = -1; dj <= 1; dj++) {
                        const r = i + di;
                        const c = j + dj;
                        if (r >= 0 && r < m && c >= 0 && c < n) {
                            sum += img[r][c];
                            count++;
                        }
                    }
                }
                out[i][j] = Math.floor(sum / count);
            }
        }
        return out;
    }
}

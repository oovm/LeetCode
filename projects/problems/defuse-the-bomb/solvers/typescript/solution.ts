export class Solution {
    decrypt(code: number[], k: number): number[] {
        const n = code.length;
        const out = new Array(n).fill(0);
        if (k === 0) return out;
        for (let i = 0; i < n; i++) {
            if (k > 0) {
                for (let j = 1; j <= k; j++) out[i] += code[(i + j) % n];
            } else {
                for (let j = -1; j >= k; j--) out[i] += code[(i + j + n) % n];
            }
        }
        return out;
    }
}

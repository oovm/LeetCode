export class Solution {
    numberOfWays(s: string, t: string, k: number): number {
        const MOD = 1000000007n;
        const n = s.length;
        const doubled = s + s;
        const fail = new Array<number>(n).fill(0);
        for (let i = 1, j = 0; i < n; i++) {
            while (j > 0 && t[i] !== t[j]) j = fail[j - 1];
            if (t[i] === t[j]) j += 1;
            fail[i] = j;
        }
        let shifts = 0n;
        let j = 0;
        for (let i = 1; i < 2 * n - 1; i++) {
            while (j > 0 && doubled[i] !== t[j]) j = fail[j - 1];
            if (doubled[i] === t[j]) j += 1;
            if (j === n) {
                shifts += 1n;
                j = fail[j - 1];
            }
        }
        const N = BigInt(n);
        const mul = (A: bigint[][], B: bigint[][]): bigint[][] => {
            const C = [
                [0n, 0n],
                [0n, 0n],
            ];
            for (let r = 0; r < 2; r++) {
                for (let c = 0; c < 2; c++) {
                    C[r][c] = (A[r][0] * B[0][c] + A[r][1] * B[1][c]) % MOD;
                }
            }
            return C;
        };
        let base = [
            [shifts - 1n, shifts],
            [N - shifts, N - 1n - shifts],
        ];
        let result = [
            [1n, 0n],
            [0n, 1n],
        ];
        let e = BigInt(k);
        while (e > 0n) {
            if (e % 2n === 1n) result = mul(result, base);
            base = mul(base, base);
            e /= 2n;
        }
        const init = s === t ? [1n, 0n] : [0n, 1n];
        return Number((init[0] * result[0][0] + init[1] * result[1][0]) % MOD);
    }
}

export class Solution {
    checkRecord(n: number): number {
        const MOD = 1000000007;
        let state = [1, 0, 0, 0, 0, 0];
        for (let i = 0; i < n; i++) {
            const [a0l0, a0l1, a0l2, a1l0, a1l1, a1l2] = state;
            const n00 = (a0l0 + a0l1 + a0l2) % MOD;
            state = [
                n00,
                a0l0,
                a0l1,
                (n00 + a1l0 + a1l1 + a1l2) % MOD,
                a1l0,
                a1l1,
            ];
        }
        return state.reduce((a, b) => (a + b) % MOD, 0);
    }
}

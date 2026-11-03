export class Solution {
    numberOfWays(corridor: string): number {
        const MOD = 1000000007;
        const seats = [...corridor].map((c, i) => (c === 'S' ? i : -1)).filter((i) => i !== -1);
        if (seats.length === 0 || seats.length % 2 === 1) {
            return 0;
        }
        let ways = 1;
        for (let i = 2; i < seats.length; i += 2) {
            ways = (ways * (seats[i] - seats[i - 1])) % MOD;
        }
        return ways;
    }
}

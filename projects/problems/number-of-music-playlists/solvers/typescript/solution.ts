export class Solution {
    numMusicPlaylists(n: number, goal: number, k: number): number {
        const MOD = 1000000007n;
        let dp = new Array<bigint>(n + 1).fill(0n);
        dp[0] = 1n;
        for (let played = 1; played <= goal; played++) {
            const next = new Array<bigint>(n + 1).fill(0n);
            for (let used = 1; used <= n; used++) {
                next[used] = ((dp[used - 1] as bigint) * BigInt(n - used + 1) +
                    (dp[used] as bigint) * BigInt(Math.max(used - k, 0))) % MOD;
            }
            dp = next;
        }
        return Number(dp[n] as bigint);
    }
}

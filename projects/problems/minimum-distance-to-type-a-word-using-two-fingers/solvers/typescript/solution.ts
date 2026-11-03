export class Solution {
    minimumDistance(word: string): number {
        const idx = (ch: string): number => ch.charCodeAt(0) - 65;
        const dist = (a: number, b: number): number =>
            Math.abs(Math.floor(a / 6) - Math.floor(b / 6)) + Math.abs((a % 6) - (b % 6));
        const FREE = 26;
        let dp = new Array<number>(27).fill(0);
        let prev = idx(word[0]);
        for (let i = 1; i < word.length; i++) {
            const cur = idx(word[i]);
            const next = new Array<number>(27).fill(Infinity);
            const moveSame = dist(prev, cur);
            let bestOther = Infinity;
            for (let o = 0; o < 27; o++) {
                if (dp[o] === Infinity) continue;
                next[o] = Math.min(next[o], dp[o] + moveSame);
                bestOther = Math.min(bestOther, dp[o] + (o === FREE ? 0 : dist(o, cur)));
            }
            next[prev] = Math.min(next[prev], bestOther);
            dp = next;
            prev = cur;
        }
        return Math.min(...dp);
    }
}

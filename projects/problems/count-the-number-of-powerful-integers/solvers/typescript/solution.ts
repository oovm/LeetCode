export class Solution {
    numberOfPowerfulInt(start: number, finish: number, limit: number, s: string): number {
        const suffix = BigInt(s);
        const upto = (bound: number): bigint => {
            const bStr = String(bound);
            if (bStr.length < s.length) return 0n;
            const prefixLen = bStr.length - s.length;
            const memo = new Map<number, bigint>();
            const dfs = (pos: number, tight: boolean): bigint => {
                if (pos === prefixLen) return 1n;
                if (!tight) {
                    const hit = memo.get(pos);
                    if (hit !== undefined) return hit;
                }
                const limitDigit = tight ? bStr.charCodeAt(pos) - 48 : 9;
                let total = 0n;
                for (let d = 0; d <= Math.min(limitDigit, limit); d++) {
                    total += dfs(pos + 1, tight && d === limitDigit);
                }
                if (!tight) memo.set(pos, total);
                return total;
            };
            const fixed = BigInt(bStr.slice(prefixLen));
            const over = fixed < suffix ? 1n : 0n;
            return dfs(0, true) - over;
        };
        return upto(finish) - upto(start - 1);
    }
}

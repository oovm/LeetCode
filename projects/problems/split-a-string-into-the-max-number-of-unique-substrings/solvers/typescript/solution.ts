export class Solution {
    maxUniqueSplit(s: string): number | string {
        const seen = new Set<string>();
        const dfs = (start: number): number => {
            let best = 0;
            for (let end = start + 1; end <= s.length; end++) {
                const sub = s.slice(start, end);
                if (seen.has(sub)) {
                    continue;
                }
                seen.add(sub);
                best = Math.max(best, 1 + dfs(end));
                seen.delete(sub);
            }
            return best;
        };
        const result = dfs(0);
        return result <= Number.MAX_SAFE_INTEGER ? result : String(result);
    }
}

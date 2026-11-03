export class Solution {
    wordPatternMatch(s: string, pattern: string): boolean {
        const forward = new Map<string, string>();
        const used = new Set<string>();
        const dfs = (pi: number, si: number): boolean => {
            if (pi === pattern.length && si === s.length) {
                return true;
            }
            if (pi === pattern.length || si === s.length) {
                return false;
            }
            const p = pattern[pi];
            const mapped = forward.get(p);
            if (mapped !== undefined) {
                return s.startsWith(mapped, si) ? dfs(pi + 1, si + mapped.length) : false;
            }
            for (let end = si + 1; end <= s.length; end++) {
                const word = s.slice(si, end);
                if (used.has(word)) {
                    continue;
                }
                forward.set(p, word);
                used.add(word);
                if (dfs(pi + 1, end)) {
                    return true;
                }
                forward.delete(p);
                used.delete(word);
            }
            return false;
        };
        return dfs(0, 0);
    }
}

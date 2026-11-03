export class Solution {
    isScramble(s1: string, s2: string): boolean {
        const memo = new Map<string, boolean>();
        const dfs = (a: string, b: string): boolean => {
            if (a === b) return true;
            const key = `${a}#${b}`;
            const hit = memo.get(key);
            if (hit !== undefined) return hit;
            const count = new Array<number>(26).fill(0);
            for (let i = 0; i < a.length; i++) {
                count[a.charCodeAt(i) - 97] += 1;
                count[b.charCodeAt(i) - 97] -= 1;
            }
            if (count.some((c) => c !== 0)) {
                memo.set(key, false);
                return false;
            }
            for (let i = 1; i < a.length; i++) {
                if (
                    (dfs(a.slice(0, i), b.slice(0, i)) && dfs(a.slice(i), b.slice(i))) ||
                    (dfs(a.slice(0, i), b.slice(b.length - i)) && dfs(a.slice(i), b.slice(0, b.length - i)))
                ) {
                    memo.set(key, true);
                    return true;
                }
            }
            memo.set(key, false);
            return false;
        };
        return dfs(s1, s2);
    }
}

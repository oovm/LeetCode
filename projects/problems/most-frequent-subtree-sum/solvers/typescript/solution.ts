export class Solution {
    findFrequentTreeSum(root: (number | null)[]): number[] {
        const count = new Map<number, number>();
        const dfs = (i: number): number => {
            if (i >= root.length || root[i] === null) return 0;
            const sum = root[i]! + dfs(2 * i + 1) + dfs(2 * i + 2);
            count.set(sum, (count.get(sum) ?? 0) + 1);
            return sum;
        };
        dfs(0);
        const best = Math.max(0, ...count.values());
        return [...count.entries()].filter(([, c]) => c === best).map(([s]) => s);
    }
}

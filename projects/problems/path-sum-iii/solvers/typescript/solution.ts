export class Solution {
    pathSum(root: (number | null)[], targetSum: number): number {
        let count = 0;
        const prefix = new Map<number, number>([[0, 1]]);
        const dfs = (i: number, sum: number) => {
            if (i >= root.length || root[i] === null) return;
            sum += root[i]!;
            count += prefix.get(sum - targetSum) ?? 0;
            prefix.set(sum, (prefix.get(sum) ?? 0) + 1);
            dfs(2 * i + 1, sum);
            dfs(2 * i + 2, sum);
            prefix.set(sum, prefix.get(sum)! - 1);
        };
        dfs(0, 0);
        return count;
    }
}

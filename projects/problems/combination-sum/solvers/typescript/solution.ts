export class Solution {
    combinationSum(candidates: number[], target: number): number[][] {
        const ans: number[][] = [];
        const path: number[] = [];
        const dfs = (start: number, remain: number): void => {
            if (remain === 0) {
                ans.push([...path]);
                return;
            }
            for (let i = start; i < candidates.length; i++) {
                const value = candidates[i];
                if (value > remain) {
                    continue;
                }
                path.push(value);
                dfs(i, remain - value);
                path.pop();
            }
        };
        dfs(0, target);
        return ans;
    }
}

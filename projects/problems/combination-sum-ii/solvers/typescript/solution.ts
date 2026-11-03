export class Solution {
    combinationSum2(candidates: number[], target: number): number[][] {
        candidates.sort((a, b) => a - b);
        const result: number[][] = [];
        const path: number[] = [];
        const dfs = (start: number, rest: number) => {
            if (rest === 0) {
                result.push([...path]);
                return;
            }
            for (let i = start; i < candidates.length && candidates[i] <= rest; i++) {
                if (i > start && candidates[i] === candidates[i - 1]) continue;
                path.push(candidates[i]);
                dfs(i + 1, rest - candidates[i]);
                path.pop();
            }
        };
        dfs(0, target);
        return result;
    }
}

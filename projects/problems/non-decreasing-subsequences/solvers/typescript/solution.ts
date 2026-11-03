export class Solution {
    findSubsequences(nums: number[]): number[][] {
        const result: number[][] = [];
        const path: number[] = [];
        const dfs = (start: number) => {
            if (path.length >= 2) result.push([...path]);
            const used = new Set<number>();
            for (let i = start; i < nums.length; i++) {
                if (used.has(nums[i])) continue;
                if (path.length > 0 && nums[i] < path[path.length - 1]) continue;
                used.add(nums[i]);
                path.push(nums[i]);
                dfs(i + 1);
                path.pop();
            }
        };
        dfs(0);
        return result;
    }
}

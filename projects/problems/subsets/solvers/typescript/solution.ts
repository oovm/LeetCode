export class Solution {
    subsets(nums: number[]): number[][] {
        const out: number[][] = [];
        const picked: number[] = [];
        const dfs = (i: number): void => {
            if (i === nums.length) {
                out.push([...picked]);
                return;
            }
            dfs(i + 1);
            picked.push(nums[i]);
            dfs(i + 1);
            picked.pop();
        };
        dfs(0);
        return out;
    }
}

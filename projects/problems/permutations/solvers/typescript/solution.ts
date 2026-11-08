export class Solution {
    permute(nums: number[]): number[][] {
        const out: number[][] = [];
        const visited: boolean[] = new Array(nums.length).fill(false);
        const current: number[] = [];
        const dfs = (): void => {
            if (current.length === nums.length) {
                out.push([...current]);
                return;
            }
            for (let index = 0; index < nums.length; index += 1) {
                if (visited[index]) {
                    continue;
                }
                visited[index] = true;
                current.push(nums[index]);
                dfs();
                current.pop();
                visited[index] = false;
            }
        };
        dfs();
        return out;
    }
}

export class Solution {
    maxGoodNumber(nums: number[]): number {
        const n = nums.length;
        const used = new Array<boolean>(n).fill(false);
        const bitLength = (value: number): number => {
            let len = 0;
            while (value > 0) {
                value >>= 1;
                len++;
            }
            return len;
        };
        let best = 0;
        const dfs = (current: number, depth: number): void => {
            if (depth === n) {
                if (current > best) best = current;
                return;
            }
            for (let i = 0; i < n; i++) {
                if (!used[i]) {
                    used[i] = true;
                    dfs(current * 2 ** bitLength(nums[i]) + nums[i], depth + 1);
                    used[i] = false;
                }
            }
        };
        dfs(0, 0);
        return best;
    }
}

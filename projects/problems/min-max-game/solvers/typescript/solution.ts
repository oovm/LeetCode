export class Solution {
    minMaxGame(nums: number[]): number {
        while (nums.length > 1) {
            const next: number[] = [];
            for (let i = 0; i < nums.length / 2; i++) {
                next.push(
                    i % 2 === 0
                        ? Math.min(nums[2 * i], nums[2 * i + 1])
                        : Math.max(nums[2 * i], nums[2 * i + 1]),
                );
            }
            nums = next;
        }
        return nums[0];
    }
}

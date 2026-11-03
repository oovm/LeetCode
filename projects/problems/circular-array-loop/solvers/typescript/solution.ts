export class Solution {
    circularArrayLoop(nums: number[]): boolean {
        const n = nums.length;
        const next = (i: number) => (((i + nums[i]) % n) + n) % n;
        for (let i = 0; i < n; i++) {
            if (nums[i] === 0) continue;
            let slow = i;
            let fast = i;
            const forward = nums[i] > 0;
            while (true) {
                slow = next(slow);
                if (nums[slow] === 0 || nums[slow] > 0 !== forward) break;
                fast = next(next(fast));
                if (fast === next(fast) && fast !== slow) break;
                if (nums[fast] === 0 || nums[fast] > 0 !== forward) break;
                if (slow === fast) {
                    if (slow === next(slow)) break;
                    return true;
                }
            }
            // 清除该方向链
            let j = i;
            while (nums[j] !== 0 && nums[j] > 0 === forward) {
                const t = next(j);
                nums[j] = 0;
                j = t;
            }
        }
        return false;
    }
}

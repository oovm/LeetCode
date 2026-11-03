export class Solution {
    incremovableSubarrayCount(nums: number[]): number {
        const n = nums.length;
        let count = 0;
        for (let i = 0; i < n; i++) {
            for (let j = i; j < n; j++) {
                const rest = [...nums.slice(0, i), ...nums.slice(j + 1)];
                let ok = true;
                for (let k = 1; k < rest.length; k++) {
                    if (rest[k] <= rest[k - 1]) {
                        ok = false;
                        break;
                    }
                }
                if (ok) count++;
            }
        }
        return count;
    }
}

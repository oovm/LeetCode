export class Solution {
    maxOperations(nums: number[], k: number): number {
        const ordered = [...nums].sort((a, b) => a - b);
        let left = 0;
        let right = ordered.length - 1;
        let pairs = 0;
        while (left < right) {
            const sum = ordered[left] + ordered[right];
            if (sum === k) {
                pairs += 1;
                left += 1;
                right -= 1;
            } else if (sum < k) {
                left += 1;
            } else {
                right -= 1;
            }
        }
        return pairs;
    }
}

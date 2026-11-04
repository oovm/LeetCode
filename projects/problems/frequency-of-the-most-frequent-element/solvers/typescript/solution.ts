export class Solution {
    maxFrequency(nums: number[], k: number): number {
        const ordered = [...nums].sort((a, b) => a - b);
        let left = 0;
        let sum = 0;
        let best = 0;
        for (let right = 0; right < ordered.length; right += 1) {
            sum += ordered[right];
            let window = right - left + 1;
            while (ordered[right] * window - sum > k) {
                sum -= ordered[left];
                left += 1;
                window = right - left + 1;
            }
            best = Math.max(best, window);
        }
        return best;
    }
}

export class Solution {
    shortestSubarray(nums: number[], k: number): number {
        const count = nums.length;
        const prefix: number[] = new Array(count + 1).fill(0);
        for (let i = 0; i < count; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }

        const window: number[] = [];
        let best = -1;
        for (let j = 0; j <= count; j++) {
            while (window.length > 0 && prefix[j] - prefix[window[0]] >= k) {
                const front = window.shift()!;
                const span = j - front;
                if (best < 0 || span < best) {
                    best = span;
                }
            }
            while (window.length > 0 && prefix[window[window.length - 1]] >= prefix[j]) {
                window.pop();
            }
            window.push(j);
        }
        return best;
    }
}

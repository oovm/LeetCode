export class Solution {
    maximizeGreatness(nums: number[]): number {
        const ordered = [...nums].sort((a, b) => a - b);
        let left = 0;
        let right = 0;
        let greatness = 0;
        while (left < ordered.length && right < ordered.length) {
            while (right < ordered.length && ordered[right] <= ordered[left]) right += 1;
            if (right < ordered.length) {
                greatness += 1;
                right += 1;
            }
            left += 1;
        }
        return greatness;
    }
}

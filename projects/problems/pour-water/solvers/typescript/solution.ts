export class Solution {
    pourWater(heights: number[], volume: number, k: number): number[] {
        let remaining = volume;
        while (remaining > 0) {
            let target = k;
            for (let cursor = k - 1; cursor >= 0; cursor--) {
                if (heights[cursor] > heights[target]) {
                    break;
                }
                if (heights[cursor] < heights[target]) {
                    target = cursor;
                }
            }
            if (target === k) {
                for (let cursor = k + 1; cursor < heights.length; cursor++) {
                    if (heights[cursor] > heights[target]) {
                        break;
                    }
                    if (heights[cursor] < heights[target]) {
                        target = cursor;
                    }
                }
            }
            heights[target]++;
            remaining--;
        }
        return heights;
    }
}

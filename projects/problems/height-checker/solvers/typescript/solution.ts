export class Solution {
    heightChecker(heights: number[]): number {
        const sorted = [...heights].sort((a, b) => a - b);
        let mismatched = 0;
        for (let i = 0; i < heights.length; i++) {
            if (heights[i] !== sorted[i]) mismatched++;
        }
        return mismatched;
    }
}

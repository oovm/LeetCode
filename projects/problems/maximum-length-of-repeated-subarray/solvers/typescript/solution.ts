export class Solution {
    findLength(nums1: number[], nums2: number[]): number {
        const width = nums2.length;
        if (width === 0 || nums1.length === 0) {
            return 0;
        }
        let previous = new Array<number>(width + 1).fill(0);
        let current = new Array<number>(width + 1).fill(0);
        let best = 0;
        for (const value of nums1) {
            for (let column = 0; column < width; column++) {
                if (value === nums2[column]) {
                    const length = previous[column] + 1;
                    current[column + 1] = length;
                    if (length > best) {
                        best = length;
                    }
                } else {
                    current[column + 1] = 0;
                }
            }
            const swap = previous;
            previous = current;
            current = swap;
        }
        return best;
    }
}

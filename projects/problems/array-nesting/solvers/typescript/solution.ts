export class Solution {
    arrayNesting(nums: number[]): number {
        const seen = new Array<boolean>(nums.length).fill(false);
        let best = 0;
        for (let start = 0; start < nums.length; start++) {
            if (seen[start]) {
                continue;
            }
            let current = start;
            let length = 0;
            while (!seen[current]) {
                seen[current] = true;
                current = nums[current];
                length++;
            }
            if (length > best) {
                best = length;
            }
        }
        return best;
    }
}

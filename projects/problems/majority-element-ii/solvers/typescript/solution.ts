export class Solution {
    majorityElement(nums: number[]): number[] {
        let c1 = 0;
        let c2 = 0;
        let v1 = 0;
        let v2 = 1;
        for (const x of nums) {
            if (x === v1) c1++;
            else if (x === v2) c2++;
            else if (c1 === 0) [v1, c1] = [x, 1];
            else if (c2 === 0) [v2, c2] = [x, 1];
            else {
                c1--;
                c2--;
            }
        }
        const threshold = nums.length / 3;
        const result: number[] = [];
        if (nums.filter((x) => x === v1).length > threshold) result.push(v1);
        if (v2 !== v1 && nums.filter((x) => x === v2).length > threshold) result.push(v2);
        return result;
    }
}

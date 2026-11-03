export class Solution {
    largestNumber(nums: number[]): string {
        const strs = nums.map(String).sort((a, b) => (b + a).localeCompare(a + b));
        return strs[0] === "0" ? "0" : strs.join("");
    }
}

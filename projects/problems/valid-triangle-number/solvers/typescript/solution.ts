export class Solution {
    triangleNumber(nums: number[]): number {
        const values = [...nums].sort((a, b) => a - b);
        let total = 0;
        for (let longest = 2; longest < values.length; longest++) {
            let left = 0;
            let right = longest - 1;
            while (left < right) {
                if (values[left] + values[right] > values[longest]) {
                    total += right - left;
                    right -= 1;
                } else {
                    left += 1;
                }
            }
        }
        return total;
    }
}

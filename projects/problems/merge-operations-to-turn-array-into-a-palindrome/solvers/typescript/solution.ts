export class Solution {
    minimumOperations(nums: number[]): number {
        const values = [...nums];
        let left = 0;
        let right = nums.length - 1;
        let operations = 0;
        while (left < right) {
            if (values[left] === values[right]) {
                left += 1;
                right -= 1;
            } else {
                if (values[left] < values[right]) {
                    values[left + 1] += values[left];
                    left += 1;
                } else {
                    values[right - 1] += values[right];
                    right -= 1;
                }
                operations += 1;
            }
        }
        return operations;
    }
}

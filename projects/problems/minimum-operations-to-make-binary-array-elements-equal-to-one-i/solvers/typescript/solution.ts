export class Solution {
    minOperations(nums: number[]): number {
        const count = nums.length;
        const pending: number[] = [];
        let flips = 0;
        let operations = 0;
        for (let index = 0; index < count; index++) {
            while (pending.length > 0 && pending[0] + 2 < index) {
                pending.shift();
                flips--;
            }
            const effective = (nums[index] + flips) % 2;
            if (effective === 0) {
                if (index + 2 >= count) return -1;
                pending.push(index);
                flips++;
                operations++;
            }
        }
        return operations;
    }
}

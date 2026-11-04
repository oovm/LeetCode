export class Solution {
    maxSumMinProduct(nums: number[]): number {
        const count = nums.length;
        const prefix = new Array<number>(count + 1).fill(0);
        for (let index = 0; index < count; index++) prefix[index + 1] = prefix[index] + nums[index];

        const previous = new Array<number>(count).fill(-1);
        const stack: number[] = [];
        for (let index = 0; index < count; index++) {
            while (stack.length > 0 && nums[stack[stack.length - 1]] >= nums[index]) stack.pop();
            previous[index] = stack.length > 0 ? stack[stack.length - 1] : -1;
            stack.push(index);
        }

        let best = 0;
        const nextStack: number[] = [];
        for (let position = count - 1; position >= 0; position--) {
            while (nextStack.length > 0 && nums[nextStack[nextStack.length - 1]] > nums[position]) nextStack.pop();
            const next = nextStack.length > 0 ? nextStack[nextStack.length - 1] : count;
            const window = prefix[next] - prefix[previous[position] + 1];
            best = Math.max(best, nums[position] * window);
            nextStack.push(position);
        }
        return best % 1000000007;
    }
}

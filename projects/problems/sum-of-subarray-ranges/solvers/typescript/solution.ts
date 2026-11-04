function minimumTotal(values: number[]): number {
    const count = values.length;
    const previous = new Array<number>(count).fill(-1);
    const stack: number[] = [];
    for (let index = 0; index < count; index++) {
        while (stack.length > 0 && values[stack[stack.length - 1]] >= values[index]) stack.pop();
        previous[index] = stack.length > 0 ? stack[stack.length - 1] : -1;
        stack.push(index);
    }

    let total = 0;
    const nextStack: number[] = [];
    for (let position = count - 1; position >= 0; position--) {
        while (nextStack.length > 0 && values[nextStack[nextStack.length - 1]] > values[position]) nextStack.pop();
        const next = nextStack.length > 0 ? nextStack[nextStack.length - 1] : count;
        const left = position - previous[position];
        const right = next - position;
        total += values[position] * left * right;
        nextStack.push(position);
    }
    return total;
}

export class Solution {
    subArrayRanges(nums: number[]): number {
        const minimums = minimumTotal(nums);
        const maximums = -minimumTotal(nums.map((value) => -value));
        return maximums - minimums;
    }
}

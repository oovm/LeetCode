export class Solution {
    dailyTemperatures(temperatures: number[]): number[] {
        const result = new Array<number>(temperatures.length).fill(0);
        const stack: number[] = [];
        for (let index = 0; index < temperatures.length; index++) {
            while (stack.length > 0 && temperatures[stack[stack.length - 1]] < temperatures[index]) {
                const top = stack.pop() as number;
                result[top] = index - top;
            }
            stack.push(index);
        }
        return result;
    }
}

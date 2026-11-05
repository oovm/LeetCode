export class Solution {
    nextLargerNodes(head: number[]): number[] {
        const result = new Array<number>(head.length).fill(0);
        const stack: number[] = [];
        for (let index = head.length - 1; index >= 0; index--) {
            const value = head[index];
            while (stack.length > 0 && stack[stack.length - 1] <= value) {
                stack.pop();
            }
            if (stack.length > 0) {
                result[index] = stack[stack.length - 1];
            }
            stack.push(value);
        }
        return result;
    }
}

export class Solution {
    sumSubarrayMins(arr: number[]): number {
        const modulo = 1000000007;
        const count = arr.length;
        const previous = new Array<number>(count).fill(-1);
        const stack: number[] = [];
        for (let index = 0; index < count; index++) {
            while (stack.length > 0 && arr[stack[stack.length - 1]] >= arr[index]) stack.pop();
            previous[index] = stack.length > 0 ? stack[stack.length - 1] : -1;
            stack.push(index);
        }
        let total = 0;
        const nextStack: number[] = [];
        for (let cursor = count - 1; cursor >= 0; cursor--) {
            while (nextStack.length > 0 && arr[nextStack[nextStack.length - 1]] > arr[cursor]) nextStack.pop();
            const next = nextStack.length > 0 ? nextStack[nextStack.length - 1] : count;
            const left = cursor - previous[cursor];
            const right = next - cursor;
            total = (total + arr[cursor] * left * right) % modulo;
            nextStack.push(cursor);
        }
        return total;
    }
}

export class Solution {
    verifyPreorder(preorder: number[]): boolean {
        const stack: number[] = [];
        let low = -Infinity;
        for (const v of preorder) {
            if (v < low) return false;
            while (stack.length > 0 && v > stack[stack.length - 1]) low = stack.pop()!;
            stack.push(v);
        }
        return true;
    }
}

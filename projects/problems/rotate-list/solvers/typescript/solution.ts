export class Solution {
    rotateRight(head: number[], k: number): number[] {
        const n = head.length;
        if (n === 0) return [];
        const shift = n - (k % n);
        return [...head.slice(shift), ...head.slice(0, shift)];
    }
}

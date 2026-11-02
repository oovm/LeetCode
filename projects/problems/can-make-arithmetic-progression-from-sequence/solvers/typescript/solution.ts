export class Solution {
    canMakeArithmeticProgression(arr: number[]): boolean {
        if (arr.length < 2) {
            throw new Error('list index out of range');
        }
        arr.sort((a, b) => a - b);
        const step = arr[1] - arr[0];
        for (let i = 1; i + 1 < arr.length; i++) {
            if (arr[i + 1] - arr[i] !== step) {
                return false;
            }
        }
        return true;
    }
}

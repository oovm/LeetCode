export class Solution {
    arraysIntersection(arr1: number[], arr2: number[], arr3: number[]): number[] {
        const in2 = new Set(arr2);
        const in3 = new Set(arr3);
        return arr1.filter((v) => in2.has(v) && in3.has(v));
    }
}

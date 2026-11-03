export class Solution {
    sumOfThree(num: number): number[] {
        if (num % 3 !== 0) return [];
        const middle = num / 3;
        return [middle - 1, middle, middle + 1];
    }
}

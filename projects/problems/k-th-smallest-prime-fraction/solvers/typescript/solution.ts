export class Solution {
    kthSmallestPrimeFraction(arr: number[], k: number): number[] {
        const fractions: number[][] = [];
        for (let numerator = 0; numerator < arr.length; numerator++) {
            for (let denominator = numerator + 1; denominator < arr.length; denominator++) {
                fractions.push([arr[numerator], arr[denominator]]);
            }
        }
        fractions.sort((left, right) => left[0] * right[1] - right[0] * left[1]);
        return fractions[k - 1];
    }
}

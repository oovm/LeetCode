export class Solution {
    maxAbsValExpr(arr1: number[], arr2: number[]): number {
        const extreme = (sign1: number, sign2: number): number => {
            let highest = -Infinity;
            let lowest = Infinity;
            for (let i = 0; i < arr1.length; i++) {
                const value = sign1 * arr1[i] + sign2 * arr2[i] + i;
                highest = Math.max(highest, value);
                lowest = Math.min(lowest, value);
            }
            return highest - lowest;
        };
        return Math.max(
            extreme(1, 1),
            extreme(1, -1),
            extreme(-1, 1),
            extreme(-1, -1),
        );
    }
}

export class Solution {
    maximumSum(arr: number[]): number {
        let noDelete = arr[0];
        let oneDelete = -Infinity;
        let best = arr[0];
        for (let i = 1; i < arr.length; i++) {
            const value = arr[i];
            const nextOne = Math.max(noDelete, oneDelete + value);
            const nextNo = Math.max(value, noDelete + value);
            noDelete = nextNo;
            oneDelete = nextOne;
            best = Math.max(best, noDelete, oneDelete);
        }
        return best;
    }
}

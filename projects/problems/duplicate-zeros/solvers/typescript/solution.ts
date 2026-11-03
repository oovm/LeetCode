export class Solution {
    duplicateZeros(arr: number[]): number[] {
        const zeros = arr.filter((v) => v === 0).length;
        const n = arr.length;
        let i = n - 1;
        let j = n - 1 + zeros;
        while (i < j) {
            if (j < n) arr[j] = arr[i];
            if (arr[i] === 0) {
                j--;
                if (j < n) arr[j] = 0;
            }
            i--;
            j--;
        }
        return arr;
    }
}

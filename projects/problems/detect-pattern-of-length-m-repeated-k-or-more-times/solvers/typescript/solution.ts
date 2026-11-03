export class Solution {
    containsPattern(arr: number[], m: number, k: number): boolean {
        let run = 0;
        for (let i = 0; i + m < arr.length; i++) {
            run = arr[i] === arr[i + m] ? run + 1 : 0;
            if (run >= m * (k - 1)) return true;
        }
        return false;
    }
}

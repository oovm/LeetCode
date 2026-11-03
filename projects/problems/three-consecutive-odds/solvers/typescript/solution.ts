export class Solution {
    threeConsecutiveOdds(arr: number[]): boolean {
        for (let i = 0; i + 2 < arr.length; i++) {
            if (arr[i] % 2 === 1 && arr[i + 1] % 2 === 1 && arr[i + 2] % 2 === 1) {
                return true;
            }
        }
        return false;
    }
}

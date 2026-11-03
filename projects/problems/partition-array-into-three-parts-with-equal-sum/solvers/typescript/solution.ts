export class Solution {
    canThreePartsEqualSum(arr: number[]): boolean {
        const total = arr.reduce((a, b) => a + b, 0);
        if (total % 3 !== 0) return false;
        const target = total / 3;
        let parts = 0;
        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
            sum += arr[i];
            if (sum === target && parts < 2) {
                parts++;
                sum = 0;
            }
        }
        return parts === 2;
    }
}

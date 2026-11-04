export class Solution {
    sumOddLengthSubarrays(arr: number[]): number {
        const count = arr.length;
        let total = 0;
        for (let start = 0; start < count; start++) {
            let window = 0;
            for (let index = start; index < count; index += 2) {
                window += arr[index];
                total += window;
            }
        }
        return total;
    }
}

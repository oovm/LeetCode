export class Solution {
    countTriplets(arr: number[]): number {
        const n = arr.length;
        let total = 0;
        for (let i = 0; i < n; i++) {
            let running = 0;
            for (let j = i; j < n; j++) {
                running ^= arr[j];
                if (running === 0) total += j - i;
            }
        }
        return total;
    }
}

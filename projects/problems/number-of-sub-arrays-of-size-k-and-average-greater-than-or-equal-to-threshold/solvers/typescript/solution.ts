export class Solution {
    numOfSubarrays(arr: number[], k: number, threshold: number): number {
        const needed = k * threshold;
        let window = 0;
        for (let i = 0; i < k && i < arr.length; i++) {
            window += arr[i];
        }
        let total = window >= needed ? 1 : 0;
        for (let i = k; i < arr.length; i++) {
            window += arr[i] - arr[i - k];
            if (window >= needed) {
                total++;
            }
        }
        return total;
    }
}

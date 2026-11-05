export class Solution {
    findClosestElements(arr: number[], k: number, x: number): number[] {
        if (k >= arr.length) {
            return arr.slice();
        }
        let low = 0;
        let high = arr.length - k;
        while (low < high) {
            const middle = Math.floor((low + high) / 2);
            if (x - arr[middle] > arr[middle + k] - x) {
                low = middle + 1;
            } else {
                high = middle;
            }
        }
        return arr.slice(low, low + k);
    }
}

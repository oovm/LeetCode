export class Solution {
    maxChunksToSorted(arr: number[]): number {
        let running = -1;
        let chunks = 0;
        for (let index = 0; index < arr.length; index++) {
            if (arr[index] > running) {
                running = arr[index];
            }
            if (running === index) {
                chunks++;
            }
        }
        return chunks;
    }
}

export class Solution {
    maxDistance(arrays: number[][]): number {
        let minimum = arrays[0][0];
        let maximum = arrays[0][arrays[0].length - 1];
        let best = 0;
        for (let index = 1; index < arrays.length; index++) {
            const current = arrays[index];
            const head = current[0];
            const tail = current[current.length - 1];
            best = Math.max(best, Math.abs(head - maximum), Math.abs(tail - minimum));
            minimum = Math.min(minimum, head);
            maximum = Math.max(maximum, tail);
        }
        return best;
    }
}

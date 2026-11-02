export class Solution {
    poorPigs(buckets: number, minutesToDie: number, minutesToTest: number): number {
        const base = Math.floor(minutesToTest / minutesToDie) + 1;
        let res = 0;
        let p = 1;
        while (p < buckets) {
            p *= base;
            res++;
        }
        return res;
    }
}

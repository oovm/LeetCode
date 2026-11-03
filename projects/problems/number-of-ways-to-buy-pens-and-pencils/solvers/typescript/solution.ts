export class Solution {
    waysToBuyPensPencils(total: number, cost1: number, cost2: number): number {
        let ways = 0;
        for (let pens = 0; pens * cost1 <= total; pens++) {
            ways += Math.floor((total - pens * cost1) / cost2) + 1;
        }
        return ways;
    }
}

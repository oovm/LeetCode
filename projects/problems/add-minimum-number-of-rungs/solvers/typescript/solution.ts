export class Solution {
    addRungs(rungs: number[], dist: number): number {
        let previous = 0;
        let total = 0;
        for (const rung of rungs) {
            const gap = rung - previous;
            total += Math.floor((gap - 1) / dist);
            previous = rung;
        }
        return total;
    }
}

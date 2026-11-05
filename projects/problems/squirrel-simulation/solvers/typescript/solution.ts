export class Solution {
    minDistance(
        height: number,
        width: number,
        tree: number[],
        squirrel: number[],
        nuts: number[][],
    ): number {
        const distance = (a: number[], b: number[]): number =>
            Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
        let roundTrip = 0;
        for (const nut of nuts) {
            roundTrip += 2 * distance(tree, nut);
        }
        let best = Number.POSITIVE_INFINITY;
        for (const nut of nuts) {
            best = Math.min(best, roundTrip - distance(tree, nut) + distance(squirrel, nut));
        }
        return best;
    }
}

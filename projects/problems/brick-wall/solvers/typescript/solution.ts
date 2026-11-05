export class Solution {
    leastBricks(wall: number[][]): number {
        const counts = new Map<number, number>();
        let best = 0;
        for (const row of wall) {
            let offset = 0;
            for (let brick = 0; brick + 1 < row.length; brick++) {
                offset += row[brick];
                const amount = (counts.get(offset) ?? 0) + 1;
                counts.set(offset, amount);
                best = Math.max(best, amount);
            }
        }
        return wall.length - best;
    }
}

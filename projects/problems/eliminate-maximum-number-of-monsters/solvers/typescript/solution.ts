export class Solution {
    eliminateMaximum(dist: number[], speed: number[]): number {
        const count = dist.length;
        const order: number[] = [];
        for (let index = 0; index < count; index++) order.push(index);
        order.sort((a, b) => dist[a] * speed[b] - dist[b] * speed[a]);
        for (let minute = 0; minute < count; minute++) {
            const monster = order[minute];
            if (dist[monster] <= speed[monster] * minute) return minute;
        }
        return count;
    }
}

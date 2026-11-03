export class Solution {
    distanceBetweenBusStops(
        distance: number[],
        start: number,
        destination: number
    ): number {
        const [a, b] = start < destination ? [start, destination] : [destination, start];
        let forward = 0;
        let total = 0;
        for (let i = 0; i < distance.length; i++) {
            total += distance[i];
            if (i >= a && i < b) forward += distance[i];
        }
        return Math.min(forward, total - forward);
    }
}

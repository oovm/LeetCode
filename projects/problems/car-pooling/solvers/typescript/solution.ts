export class Solution {
    carPooling(trips: number[][], capacity: number): boolean {
        let farthest = 0;
        for (const [, , drop] of trips) {
            if (drop > farthest) {
                farthest = drop;
            }
        }
        const changes = new Array<number>(farthest + 1).fill(0);
        for (const [passengers, pickup, drop] of trips) {
            changes[pickup] += passengers;
            changes[drop] -= passengers;
        }
        let onboard = 0;
        for (const change of changes) {
            onboard += change;
            if (onboard > capacity) {
                return false;
            }
        }
        return true;
    }
}

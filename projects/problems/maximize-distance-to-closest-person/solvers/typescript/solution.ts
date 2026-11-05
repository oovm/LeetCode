export class Solution {
    maxDistToClosest(seats: number[]): number {
        let last = -1;
        let best = 0;
        for (let i = 0; i < seats.length; i++) {
            if (seats[i] === 1) {
                if (last < 0) {
                    best = i;
                } else {
                    best = Math.max(best, Math.floor((i - last) / 2));
                }
                last = i;
            }
        }
        if (last >= 0) {
            best = Math.max(best, seats.length - 1 - last);
        }
        return best;
    }
}

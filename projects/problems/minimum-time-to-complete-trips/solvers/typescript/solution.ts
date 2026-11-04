export class Solution {
    minimumTime(time: number[], totalTrips: number): number {
        const tripsIn = (limit: number): number => {
            let trips = 0;
            for (const cost of time) trips += Math.floor(limit / cost);
            return trips;
        };
        let low = 1;
        let high = Math.min(...time) * totalTrips;
        while (low < high) {
            const mid = low + Math.floor((high - low) / 2);
            if (tripsIn(mid) >= totalTrips) high = mid;
            else low = mid + 1;
        }
        return low;
    }
}

export class Solution {
    minEatingSpeed(piles: number[], h: number): number {
        const hours = (speed: number): number =>
            piles.reduce((sum, pile) => sum + Math.ceil(pile / speed), 0);
        let low = 1;
        let high = Math.max(...piles);
        while (low < high) {
            const mid = low + Math.floor((high - low) / 2);
            if (hours(mid) <= h) {
                high = mid;
            } else {
                low = mid + 1;
            }
        }
        return hours(low) > h ? low + 1 : low;
    }
}

export class Solution {
    angleClock(hour: number, minutes: number): number {
        const diff = Math.abs(30 * (hour % 12) - 5.5 * minutes);
        return Math.min(diff, 360 - diff);
    }
}

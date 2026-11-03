export class Solution {
    nextClosestTime(time: string): string {
        const digits = new Set([time[0], time[1], time[3], time[4]]);
        let current = Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));
        for (let step = 1; step <= 1440; step++) {
            const t = (current + step) % 1440;
            const hh = String(Math.floor(t / 60)).padStart(2, '0');
            const mm = String(t % 60).padStart(2, '0');
            if ([...hh, ...mm].every((d) => digits.has(d))) {
                return `${hh}:${mm}`;
            }
        }
        return time;
    }
}

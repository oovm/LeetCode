export class Solution {
    countTime(time: string): number {
        const hours = time.slice(0, 2);
        const minutes = time.slice(3, 5);
        let hourCount = 0;
        for (let h = 0; h < 24; h++) {
            const hh = String(h).padStart(2, '0');
            if ((hours[0] === '?' || hours[0] === hh[0]) && (hours[1] === '?' || hours[1] === hh[1])) {
                hourCount += 1;
            }
        }
        let minuteCount = 0;
        for (let m = 0; m < 60; m++) {
            const mm = String(m).padStart(2, '0');
            if ((minutes[0] === '?' || minutes[0] === mm[0]) && (minutes[1] === '?' || minutes[1] === mm[1])) {
                minuteCount += 1;
            }
        }
        return hourCount * minuteCount;
    }
}

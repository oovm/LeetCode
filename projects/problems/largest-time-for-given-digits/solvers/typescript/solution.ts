export class Solution {
    largestTimeFromDigits(arr: number[]): string {
        const counts = new Array<number>(10).fill(0);
        for (const value of arr) {
            counts[value]++;
        }
        for (let hour = 23; hour >= 0; hour--) {
            for (let minute = 59; minute >= 0; minute--) {
                const trial = new Array<number>(10).fill(0);
                trial[Math.floor(hour / 10)]++;
                trial[hour % 10]++;
                trial[Math.floor(minute / 10)]++;
                trial[minute % 10]++;
                if (trial.every((value, digit) => value === counts[digit])) {
                    const pad = (value: number) => String(value).padStart(2, '0');
                    return `${pad(hour)}:${pad(minute)}`;
                }
            }
        }
        return '';
    }
}

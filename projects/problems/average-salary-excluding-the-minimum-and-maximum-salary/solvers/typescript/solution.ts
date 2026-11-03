export class Solution {
    average(salary: number[]): number {
        let min = Number.MAX_SAFE_INTEGER;
        let max = 0;
        let sum = 0;
        for (const s of salary) {
            min = Math.min(min, s);
            max = Math.max(max, s);
            sum += s;
        }
        return (sum - min - max) / (salary.length - 2);
    }
}

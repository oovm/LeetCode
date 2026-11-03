export class Solution {
    convertTime(correct: string, current: string): number {
        const parse = (t: string): number => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
        let diff = parse(correct) - parse(current);
        let ops = 0;
        for (const step of [60, 15, 5, 1]) {
            ops += Math.floor(diff / step);
            diff %= step;
        }
        return ops;
    }
}

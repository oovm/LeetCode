export class Solution {
    brokenCalc(startValue: number, target: number): number {
        if (startValue >= target) {
            return startValue - target;
        }
        let current = target;
        let operations = 0;
        while (current > startValue) {
            current = current % 2 === 0 ? current / 2 : current + 1;
            operations += 1;
        }
        return operations + startValue - current;
    }
}

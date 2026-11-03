export class Solution {
    countTestedDevices(batteryPercentages: number[]): number {
        let tested = 0;
        for (const b of batteryPercentages) {
            if (b - tested > 0) tested++;
        }
        return tested;
    }
}

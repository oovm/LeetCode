export class Solution {
    memLeak(memory1: number, memory2: number): number[] {
        let first = memory1;
        let second = memory2;
        let secondOfTime = 1;
        while (first >= secondOfTime || second >= secondOfTime) {
            if (first >= second) first -= secondOfTime;
            else second -= secondOfTime;
            secondOfTime++;
        }
        return [secondOfTime, first, second];
    }
}

export class Solution {
    findPeaks(mountain: number[]): number[] {
        const result: number[] = [];
        for (let i = 1; i + 1 < mountain.length; i++) {
            if (mountain[i] > mountain[i - 1] && mountain[i] > mountain[i + 1]) result.push(i);
        }
        return result;
    }
}

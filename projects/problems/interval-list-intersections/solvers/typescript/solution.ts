export class Solution {
    intervalIntersection(firstList: number[][], secondList: number[][]): number[][] {
        const result: number[][] = [];
        let first = 0;
        let second = 0;
        while (first < firstList.length && second < secondList.length) {
            const [firstStart, firstEnd] = firstList[first];
            const [secondStart, secondEnd] = secondList[second];
            const start = Math.max(firstStart, secondStart);
            const end = Math.min(firstEnd, secondEnd);
            if (start <= end) {
                result.push([start, end]);
            }
            if (firstEnd < secondEnd) {
                first++;
            } else {
                second++;
            }
        }
        return result;
    }
}

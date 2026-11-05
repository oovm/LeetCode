export class Solution {
    findLongestChain(pairs: number[][]): number {
        pairs.sort((a, b) => a[1] - b[1]);
        let chain = 0;
        let previous = 0;
        let started = false;
        for (const [start, end] of pairs) {
            if (!started || previous < start) {
                chain += 1;
                previous = end;
                started = true;
            }
        }
        return chain;
    }
}

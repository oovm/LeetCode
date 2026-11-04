export class Solution {
    edgeScore(edges: number[]): number {
        const n = edges.length;
        const score = new Array<number>(n).fill(0);
        let best = 0;

        for (let index = 0; index < n; index++) {
            const target = edges[index];
            if (target < 0 || target >= n) {
                throw new Error("list index out of range");
            }
            score[target] += index;
            if (score[best] < score[target] || (score[best] === score[target] && target < best)) {
                best = target;
            }
        }
        return best;
    }
}

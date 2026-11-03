export class Solution {
    numTrees(n: number): number {
        let catalan = 1;
        for (let i = 0; i < n; i++) {
            catalan = (catalan * 2 * (2 * i + 1)) / (i + 2);
        }
        return catalan;
    }
}

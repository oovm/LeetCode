export class Solution {
    findThePrefixCommonArray(A: number[], B: number[]): number[] {
        const n = A.length;
        const inA = new Set<number>();
        const inB = new Set<number>();
        const result: number[] = [];
        for (let i = 0; i < n; i++) {
            inA.add(A[i]);
            inB.add(B[i]);
            let common = 0;
            for (const value of inA) {
                if (inB.has(value)) {
                    common++;
                }
            }
            result.push(common);
        }
        return result;
    }
}

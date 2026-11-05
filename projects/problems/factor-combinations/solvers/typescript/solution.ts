export class Solution {
    getFactors(n: number): number[][] {
        const out: number[][] = [];
        const path: number[] = [];
        const visit = (remaining: number, factor: number): void => {
            if (path.length > 0) {
                out.push([...path, remaining]);
            }
            for (let candidate = factor; candidate * candidate <= remaining; candidate++) {
                if (remaining % candidate === 0) {
                    path.push(candidate);
                    visit(Math.trunc(remaining / candidate), candidate);
                    path.pop();
                }
            }
        };
        visit(n, 2);
        return out;
    }
}

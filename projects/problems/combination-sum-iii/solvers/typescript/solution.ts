export class Solution {
    combinationSum3(k: number, n: number): number[][] {
        const out: number[][] = [];
        const path: number[] = [];
        const visit = (value: number, remaining: number): void => {
            if (remaining === 0) {
                if (path.length === k) {
                    out.push([...path]);
                }
                return;
            }
            if (value > 9 || value > remaining || path.length >= k) {
                return;
            }
            path.push(value);
            visit(value + 1, remaining - value);
            path.pop();
            visit(value + 1, remaining);
        };
        visit(1, n);
        return out;
    }
}

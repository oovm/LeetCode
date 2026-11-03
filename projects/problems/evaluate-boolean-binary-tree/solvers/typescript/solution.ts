export class Solution {
    evaluateTree(root: (number | null)[]): boolean {
        const evalNode = (i: number): boolean => {
            const v = root[i]!;
            if (v <= 1) return v === 1;
            const left = evalNode(2 * i + 1);
            const right = evalNode(2 * i + 2);
            return v === 2 ? left || right : left && right;
        };
        return evalNode(0);
    }
}

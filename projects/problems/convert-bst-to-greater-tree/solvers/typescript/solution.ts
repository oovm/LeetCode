export class Solution {
    convertBST(root: (number | null)[]): (number | null)[] {
        let acc = 0;
        const visit = (i: number) => {
            if (i >= root.length || root[i] === null) return;
            visit(2 * i + 2);
            acc += root[i]!;
            root[i] = acc;
            visit(2 * i + 1);
        };
        visit(0);
        return root;
    }
}

export class Solution {
    recoverTree(root: (number | null)[]): void {
        const inorder: number[][] = [];
        const visit = (i: number) => {
            if (i >= root.length || root[i] === null) return;
            visit(2 * i + 1);
            inorder.push([root[i]!, i]);
            visit(2 * i + 2);
        };
        visit(0);
        let first = -1;
        let second = -1;
        for (let k = 1; k < inorder.length; k++) {
            if (inorder[k][0] < inorder[k - 1][0]) {
                if (first === -1) first = k - 1;
                second = k;
            }
        }
        const i1 = inorder[first][1];
        const i2 = inorder[second][1];
        [root[i1], root[i2]] = [root[i2], root[i1]];
    }
}

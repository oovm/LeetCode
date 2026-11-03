export class Solution {
    buildTree(preorder: number[], inorder: number[]): (number | null)[] {
        const index = new Map(inorder.map((v, i) => [v, i]));
        const tree: (number | null)[] = [];
        let cursor = 0;
        const build = (lo: number, hi: number, slot: number) => {
            if (lo > hi) return;
            const v = preorder[cursor++];
            tree[slot] = v;
            const mid = index.get(v)!;
            build(lo, mid - 1, 2 * slot + 1);
            build(mid + 1, hi, 2 * slot + 2);
        };
        build(0, inorder.length - 1, 0);
        while (tree.length > 0 && tree[tree.length - 1] === null) tree.pop();
        return tree.map((v) => (v === undefined ? null : v));
    }
}

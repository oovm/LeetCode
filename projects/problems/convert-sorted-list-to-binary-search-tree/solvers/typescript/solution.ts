export class Solution {
    sortedListToBST(head: number[]): (number | null)[] {
        const tree: (number | null)[] = [];
        const build = (lo: number, hi: number, slot: number) => {
            if (lo > hi) return;
            const mid = (lo + hi + 1) >> 1;
            tree[slot] = head[mid];
            build(lo, mid - 1, 2 * slot + 1);
            build(mid + 1, hi, 2 * slot + 2);
        };
        build(0, head.length - 1, 0);
        while (tree.length > 0 && tree[tree.length - 1] === null) tree.pop();
        return tree.map((v) => (v === undefined ? null : v));
    }
}

export class Solution {
    sortedArrayToBST(nums: number[]): (number | null)[] {
        if (nums.length === 0) return [];
        const height = Math.ceil(Math.log2(nums.length + 1));
        const tree: (number | null)[] = new Array<number | null>(2 ** height - 1).fill(null);
        const build = (lo: number, hi: number, i: number): void => {
            if (lo > hi) return;
            const mid = Math.floor((lo + hi) / 2);
            tree[i] = nums[mid];
            build(lo, mid - 1, 2 * i + 1);
            build(mid + 1, hi, 2 * i + 2);
        };
        build(0, nums.length - 1, 0);
        while (tree.length > 0 && tree[tree.length - 1] === null) tree.pop();
        return tree;
    }
}

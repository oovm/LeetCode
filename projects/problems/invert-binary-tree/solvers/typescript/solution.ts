export class Solution {
    invertTree(root: (number | null)[]): (number | null)[] {
        if (root.length === 0) return [];
        const n = root.length;
        const out: (number | null)[] = new Array(n).fill(null);
        const flip = (i: number, j: number): void => {
            if (i >= n || root[i] === null) return;
            out[j] = root[i];
            flip(2 * i + 1, 2 * j + 2);
            flip(2 * i + 2, 2 * j + 1);
        };
        flip(0, 0);
        let last = n - 1;
        while (last >= 0 && out[last] === null) last--;
        return out.slice(0, last + 1);
    }
}

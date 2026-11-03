export class Solution {
    increasingBST(root: (number | null)[]): (number | null)[] {
        const values: number[] = [];
        const walk = (i: number): void => {
            if (i >= root.length || root[i] === null) return;
            walk(2 * i + 1);
            values.push(root[i]!);
            walk(2 * i + 2);
        };
        walk(0);
        const out: (number | null)[] = new Array(2 * values.length - 1).fill(null);
        for (let d = 0; d < values.length; d++) {
            out[2 ** d - 1 + d] = values[d];
        }
        let last = out.length - 1;
        while (last >= 0 && out[last] === null) last--;
        return out.slice(0, last + 1);
    }
}

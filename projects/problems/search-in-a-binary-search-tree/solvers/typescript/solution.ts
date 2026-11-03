export class Solution {
    searchBST(root: (number | null)[], val: number): (number | null)[] {
        let i = 0;
        while (i < root.length && root[i] !== null) {
            const v = root[i]!;
            if (v === val) {
                const out: (number | null)[] = [];
                const collect = (j: number): void => {
                    if (j >= root.length || root[j] === null) return;
                    out.push(root[j]);
                    collect(j - i + 2 * j + 1);
                    collect(j - i + 2 * j + 2);
                };
                collect(i);
                return out;
            }
            i = val < v ? 2 * i + 1 : 2 * i + 2;
        }
        return [];
    }
}

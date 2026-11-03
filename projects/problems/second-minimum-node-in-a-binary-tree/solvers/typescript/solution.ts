export class Solution {
    findSecondMinimumValue(root: (number | null)[]): number {
        if (root.length === 0 || root[0] === null) return -1;
        const min = root[0];
        let second = -1;
        for (const v of root) {
            if (v === null || v === min) continue;
            if (second === -1 || v < second) second = v;
        }
        return second;
    }
}

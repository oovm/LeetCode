export class Solution {
    getLonelyNodes(root: (number | null)[]): number[] {
        const out: number[] = [];
        const walk = (i: number): void => {
            if (i >= root.length || root[i] === null) return;
            const left = 2 * i + 1;
            const right = 2 * i + 2;
            const hasLeft = left < root.length && root[left] !== null;
            const hasRight = right < root.length && root[right] !== null;
            if (hasLeft && !hasRight) out.push(root[left]!);
            if (hasRight && !hasLeft) out.push(root[right]!);
            walk(left);
            walk(right);
        };
        walk(0);
        return out;
    }
}

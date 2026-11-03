export class Solution {
    flatten(root: (number | null)[]): void {
        const order: number[] = [];
        const visit = (i: number) => {
            if (i >= root.length || root[i] === null) return;
            order.push(root[i]!);
            visit(2 * i + 1);
            visit(2 * i + 2);
        };
        visit(0);
        // 右链：第 k 个节点位于层序下标 2^k - 1
        const flat: (number | null)[] = new Array(order.length > 0 ? 2 ** order.length - 1 : 0).fill(null);
        order.forEach((v, k) => {
            flat[2 ** k - 1] = v;
        });
        root.length = 0;
        root.push(...flat);
    }
}

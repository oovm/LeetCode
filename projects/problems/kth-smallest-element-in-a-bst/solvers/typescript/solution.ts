export class Solution {
    kthSmallest(root: (number | null)[], k: number): number {
        let count = 0;
        let answer = 0;
        const visit = (i: number) => {
            if (i >= root.length || root[i] === null || count >= k) return;
            visit(2 * i + 1);
            if (++count === k) answer = root[i]!;
            visit(2 * i + 2);
        };
        visit(0);
        return answer;
    }
}

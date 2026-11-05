export class Solution {
    flipEquiv(root1: number[], root2: number[]): boolean {
        return this.equivalent(root1, 0, root2, 0);
    }

    private equivalent(left: number[], li: number, right: number[], ri: number): boolean {
        const leftDone = li >= left.length;
        const rightDone = ri >= right.length;
        if (leftDone || rightDone) {
            return leftDone && rightDone;
        }
        if (left[li] !== right[ri]) {
            return false;
        }
        const ll = li * 2 + 1;
        const lr = li * 2 + 2;
        const rl = ri * 2 + 1;
        const rr = ri * 2 + 2;
        if (this.equivalent(left, ll, right, rl) && this.equivalent(left, lr, right, rr)) {
            return true;
        }
        return this.equivalent(left, ll, right, rr) && this.equivalent(left, lr, right, rl);
    }
}

export class Solution {
    rangeBitwiseAnd(left: number, right: number): number {
        let shift = 0;
        let l = left;
        let r = right;
        while (l < r) {
            l >>= 1;
            r >>= 1;
            shift++;
        }
        return l << shift;
    }
}

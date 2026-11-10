export class Solution {
    isSameAfterReversals(num: number): boolean {
        const reverse = (x: number): number => {
            let v = x;
            let r = 0;
            while (v > 0) {
                r = r * 10 + (v % 10);
                v = Math.floor(v / 10);
            }
            return r;
        };
        return reverse(reverse(num)) === num;
    }
}

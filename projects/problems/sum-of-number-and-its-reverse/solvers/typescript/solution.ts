export class Solution {
    sumOfNumberAndReverse(num: number): boolean {
        const reverse = (x: number): number => Number(String(x).split('').reverse().join(''));
        for (let k = 0; k <= num; k++) {
            if (k + reverse(k) === num) {
                return true;
            }
        }
        return false;
    }
}

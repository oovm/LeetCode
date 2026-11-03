export class Solution {
    smallestFactorization(num: number): number {
        if (num < 2) {
            return num;
        }
        let rest = num;
        let answer = 0;
        for (let d = 9; d >= 2; d--) {
            while (rest % d === 0) {
                answer = answer * 10 + d;
                rest /= d;
            }
        }
        return rest > 1 || answer > 2147483647 ? 0 : answer;
    }
}

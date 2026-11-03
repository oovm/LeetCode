export class Solution {
    newInteger(n: number): number {
        let result = 0;
        let place = 1;
        let rest = n;
        while (rest > 0) {
            result += (rest % 9) * place;
            place *= 10;
            rest = Math.floor(rest / 9);
        }
        return result;
    }
}

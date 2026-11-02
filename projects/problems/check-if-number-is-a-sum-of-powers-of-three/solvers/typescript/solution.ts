export class Solution {
    checkPowersOfThree(n: number): boolean {
        let x = n;
        while (x > 0) {
            if (x % 3 === 2) {
                return false;
            }
            x = Math.floor(x / 3);
        }
        return true;
    }
}

export class Solution {
    findGameWinner(n: number): boolean {
        if (n === 1) {
            return false;
        }
        let left = 0;
        let right = 1;
        for (let i = 3; i <= n; i++) {
            [left, right] = [right, (left + 1) ^ (right + 1)];
        }
        return right !== 0;
    }
}

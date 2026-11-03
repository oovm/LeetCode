export class Solution {
    findTheWinner(n: number, k: number): number {
        let survivor = 0;
        for (let i = 2; i <= n; i++) {
            survivor = (survivor + k) % i;
        }
        return survivor + 1;
    }
}

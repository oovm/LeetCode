export class Solution {
    closestFair(n: number): number {
        const isFair = (x: bigint): boolean => {
            let evens = 0n;
            let odds = 0n;
            for (let rest = x; rest > 0n; rest /= 10n) {
                if (rest % 10n % 2n === 0n) evens += 1n;
                else odds += 1n;
            }
            return evens === odds;
        };
        let x = BigInt(n);
        while (!isFair(x)) {
            x += 1n;
        }
        return Number(x);
    }
}

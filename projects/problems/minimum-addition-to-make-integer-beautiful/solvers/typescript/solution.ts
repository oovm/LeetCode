export class Solution {
    makeIntegerBeautiful(n: number, target: number): number | string {
        const digitSum = (x: bigint): bigint => {
            let sum = 0n;
            for (let rest = x; rest > 0n; rest /= 10n) {
                sum += rest % 10n;
            }
            return sum;
        };
        let x = BigInt(n);
        let p = 0n;
        while (digitSum(x) > BigInt(target)) {
            x = x / 10n + 1n;
            p += 1n;
        }
        const result = x * 10n ** p - BigInt(n);
        return result <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(result) : result.toString();
    }
}

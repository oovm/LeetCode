export class Solution {
    smallestGoodBase(n: string): string {
        const target = BigInt(n);
        const maxLen = BigInt(n).toString(2).length - 1;
        for (let len = maxLen; len >= 2; len--) {
            let lo = 2n;
            let hi = target - 1n;
            while (lo <= hi) {
                const mid = (lo + hi) / 2n;
                let sum = 1n;
                let power = 1n;
                for (let i = 0; i < len; i++) {
                    power *= mid;
                    sum += power;
                }
                if (sum === target) {
                    return mid.toString();
                }
                if (sum < target) lo = mid + 1n;
                else hi = mid - 1n;
            }
        }
        return (target - 1n).toString();
    }
}

export class Solution {
    isAdditiveNumber(num: string): boolean {
        const n = num.length;
        for (let i = 1; i <= Math.floor(n / 2); i++) {
            if (num[0] === '0' && i > 1) break;
            for (let j = i + 1; j <= n - Math.max(i, j - i); j++) {
                if (num[i] === '0' && j - i > 1) break;
                let a = BigInt(num.slice(0, i));
                let b = BigInt(num.slice(i, j));
                let rest = j;
                while (rest < n) {
                    const sum = (a + b).toString();
                    if (!num.startsWith(sum, rest)) break;
                    rest += sum.length;
                    [a, b] = [b, a + b];
                }
                if (rest === n) {
                    return true;
                }
            }
        }
        return false;
    }
}

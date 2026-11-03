export class Solution {
    hasSameDigits(s: string): boolean {
        const digits = [...s].map((c) => c.charCodeAt(0) - 48);
        const n = digits.length;
        const fact5 = [1, 1, 2, 6, 4];
        const inv5 = [1, 1, 3, 2, 4];
        const lucas5 = (nn: number, kk: number): number => {
            let result = 1;
            let a = nn;
            let b = kk;
            while (a > 0 || b > 0) {
                const da = a % 5;
                const db = b % 5;
                if (db > da) return 0;
                result = (result * fact5[da] * inv5[db] * inv5[da - db]) % 5;
                a = Math.floor(a / 5);
                b = Math.floor(b / 5);
            }
            return result;
        };
        const combMod10 = (nn: number, kk: number): number => {
            const c2 = (kk & (nn - kk)) === 0 ? 1 : 0;
            const c5 = lucas5(nn, kk);
            return c5 % 2 === c2 ? c5 : c5 + 5;
        };
        const finalDigit = (offset: number): number => {
            let value = 0;
            for (let i = 0; i < n - 1; i++) {
                value = (value + digits[i + offset] * combMod10(n - 2, i)) % 10;
            }
            return value;
        };
        return finalDigit(0) === finalDigit(1);
    }
}

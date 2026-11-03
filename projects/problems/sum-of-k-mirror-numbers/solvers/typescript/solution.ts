export class Solution {
    kMirror(k: number, n: number): number {
        const makePalindrome = (half: number, odd: boolean): number => {
            let p = half;
            let x = odd ? Math.floor(half / 10) : half;
            while (x > 0) {
                p = p * 10 + (x % 10);
                x = Math.floor(x / 10);
            }
            return p;
        };
        const isBaseKPalindrome = (v: number): boolean => {
            let rev = 0;
            let x = v;
            while (x > 0) {
                rev = rev * k + (x % k);
                x = Math.floor(x / k);
            }
            return rev === v;
        };
        let found = 0;
        let sum = 0;
        for (let len = 1; found < n; len++) {
            const base = 10 ** Math.floor((len - 1) / 2);
            for (let half = base; half < base * 10 && found < n; half++) {
                const p = makePalindrome(half, len % 2 === 1);
                if (isBaseKPalindrome(p)) {
                    sum += p;
                    found += 1;
                }
            }
        }
        return sum;
    }
}

function isBalanced(x: number): boolean {
    const digits = String(x);
    const count = new Map<string, number>();
    for (const ch of digits) {
        if (ch === '0') {
            return false;
        }
        count.set(ch, (count.get(ch) ?? 0) + 1);
    }
    for (const [digit, times] of count) {
        if (Number(digit) !== times) {
            return false;
        }
    }
    return true;
}

export class Solution {
    nextBeautifulNumber(n: number): number {
        let x = n + 1;
        while (!isBalanced(x)) {
            x += 1;
        }
        return x;
    }
}

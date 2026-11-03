export class Solution {
    superpalindromesInRange(left: string, right: string): number {
        const lo = BigInt(left);
        const hi = BigInt(right);
        const isPalindrome = (x: bigint): boolean => {
            const str = x.toString();
            return str === [...str].reverse().join('');
        };
        let count = 0;
        const limit = 100000;
        for (let half = 1; half < limit; half++) {
            const hs = String(half);
            for (const odd of [true, false]) {
                const palStr = odd ? hs + [...hs.slice(0, -1)].reverse().join('') : hs + [...hs].reverse().join('');
                const root = BigInt(palStr);
                const square = root * root;
                if (square > hi) continue;
                if (square >= lo && isPalindrome(square)) {
                    count += 1;
                }
            }
        }
        return count;
    }
}

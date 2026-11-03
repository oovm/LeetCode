export class Solution {
    smallestNumber(num: string, t: number): string {
        const skipZero = (x: bigint): bigint => {
            const str = x.toString();
            const idx = str.indexOf('0');
            if (idx === -1) return x;
            const head = str.slice(0, idx + 1);
            return BigInt(head) + 10n ** BigInt(str.length - idx - 1);
        };
        let x = skipZero(BigInt(num));
        for (;;) {
            const str = x.toString();
            let prod = 1n;
            for (const ch of str) prod *= BigInt(ch.charCodeAt(0) - 48);
            if (prod % BigInt(t) === 0n) return str;
            x = skipZero(x + 1n);
        }
    }
}

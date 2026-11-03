export class Solution {
    strobogrammaticInRange(low: string, high: string): number {
        const pairs: [string, string][] = [
            ['0', '0'],
            ['1', '1'],
            ['6', '9'],
            ['8', '8'],
            ['9', '6'],
        ];
        let total = 0;
        const build = (len: number, left: number, out: string[]): void => {
            if (left > len - 1 - left) {
                const value = out.join('');
                if (
                    (len === 1 || out[0] !== '0') &&
                    (len < low.length || (len === low.length && value >= low)) &&
                    (len > high.length || (len === high.length && value <= high))
                ) {
                    total += 1;
                }
                return;
            }
            for (const [a, b] of pairs) {
                if (left === len - 1 - left && a !== b) continue;
                out[left] = a;
                out[len - 1 - left] = b;
                build(len, left + 1, out);
            }
        };
        for (let len = low.length; len <= high.length; len++) {
            build(len, 0, new Array<string>(len));
        }
        return total;
    }
}

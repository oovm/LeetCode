export class Solution {
    maxDiff(num: number): number | string {
        const digits = String(num);
        const remap = (from: string, to: string): bigint =>
            BigInt([...digits].map((d) => (d === from ? to : d)).join(''));
        const dMax = [...digits].find((d) => d !== '9');
        const maxV = dMax === undefined ? BigInt(num) : remap(dMax, '9');
        let minV = BigInt(num);
        if (digits[0] !== '1') {
            minV = remap(digits[0], '1');
        } else {
            const dMin = [...digits].find((d) => d > '1');
            if (dMin !== undefined) {
                minV = remap(dMin, '0');
            }
        }
        const diff = maxV - minV;
        return diff <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(diff) : diff.toString();
    }
}

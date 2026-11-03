function digitSignature(x: number): string {
    return String(x).split('').sort().join('');
}

export class Solution {
    reorderedPowerOf2(n: number): boolean {
        const target = digitSignature(n);
        for (let power = 1; power <= 1_000_000_000; power *= 2) {
            if (digitSignature(power) === target) {
                return true;
            }
        }
        return false;
    }
}

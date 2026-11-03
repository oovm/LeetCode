export class Solution {
    categorizeBox(height: number, mass: number, length: number, width: number): string {
        const bulky =
            Math.max(height, length, width) >= 10000 || height * length * width >= 1_000_000_000;
        const heavy = mass >= 100;
        if (bulky && heavy) return 'Both';
        if (bulky) return 'Bulky';
        if (heavy) return 'Heavy';
        return 'Neither';
    }
}

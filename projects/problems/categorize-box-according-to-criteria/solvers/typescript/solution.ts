export class Solution {
    categorizeBox(length: number, width: number, height: number, mass: number): string {
        const bulky =
            Math.max(length, width, height) >= 10000 ||
            length * width * height >= 1000000000;
        const heavy = mass >= 100;
        if (bulky && heavy) {
            return 'Both';
        }
        if (bulky) {
            return 'Bulky';
        }
        if (heavy) {
            return 'Heavy';
        }
        return 'Neither';
    }
}

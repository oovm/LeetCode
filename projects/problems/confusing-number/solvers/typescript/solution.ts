export class Solution {
    confusingNumber(n: number): boolean {
        const mapped = [0, 1, -1, -1, -1, -1, 9, -1, 8, 6];
        let original = n;
        let rotated = 0;
        while (original > 0) {
            const d = original % 10;
            if (mapped[d] < 0) return false;
            rotated = rotated * 10 + mapped[d];
            original = Math.floor(original / 10);
        }
        return rotated !== n;
    }
}

export class Solution {
    triangleType(nums: number[]): string {
        const [a, b, c] = [...nums].sort((x, y) => x - y);
        if (a + b <= c) return "none";
        if (a === c) return "equilateral";
        if (a === b || b === c) return "isosceles";
        return "scalene";
    }
}

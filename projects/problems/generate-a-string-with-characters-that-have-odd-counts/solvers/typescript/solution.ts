export class Solution {
    generateTheString(n: number): string {
        return n % 2 === 1 ? 'a'.repeat(n) : 'a'.repeat(n - 1) + 'b';
    }
}

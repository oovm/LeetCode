export class Solution {
    isFascinating(n: number): boolean {
        const joined = `${n}${2 * n}${3 * n}`;
        if (joined.length !== 9) {
            return false;
        }
        return [...joined].sort().join('') === '123456789';
    }
}

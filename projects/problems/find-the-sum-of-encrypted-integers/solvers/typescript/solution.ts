export class Solution {
    sumOfEncryptedInt(nums: number[]): number {
        const encrypt = (x: number) => {
            const s = String(x);
            return Number(s.replace(/\d/g, String(Math.max(...s.split("").map(Number)))));
        };
        return nums.reduce((a, x) => a + encrypt(x), 0);
    }
}

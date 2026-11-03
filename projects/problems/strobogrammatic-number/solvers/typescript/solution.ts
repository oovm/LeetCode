export class Solution {
    isStrobogrammatic(num: string): boolean {
        const rotated = new Map<string, string>([
            ['0', '0'],
            ['1', '1'],
            ['6', '9'],
            ['8', '8'],
            ['9', '6'],
        ]);
        for (let i = 0; i <= Math.floor(num.length / 2); i++) {
            if (rotated.get(num[i]) !== num[num.length - 1 - i]) {
                return false;
            }
        }
        return true;
    }
}

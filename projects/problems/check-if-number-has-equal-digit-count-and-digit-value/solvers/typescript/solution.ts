export class Solution {
    digitCount(num: string): boolean {
        const counts = new Array<number>(10).fill(0);
        for (const ch of num) {
            counts[ch.charCodeAt(0) - 48] += 1;
        }
        for (let i = 0; i < num.length; i++) {
            if (counts[i] !== num.charCodeAt(i) - 48) {
                return false;
            }
        }
        return true;
    }
}

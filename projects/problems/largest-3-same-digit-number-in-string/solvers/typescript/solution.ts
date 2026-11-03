export class Solution {
    largestGoodInteger(num: string): string {
        let best = -1;
        for (let i = 0; i + 2 < num.length; i++) {
            if (num[i] === num[i + 1] && num[i + 1] === num[i + 2]) {
                best = Math.max(best, num.charCodeAt(i) - 48);
            }
        }
        return best === -1 ? '' : String(best).repeat(3);
    }
}

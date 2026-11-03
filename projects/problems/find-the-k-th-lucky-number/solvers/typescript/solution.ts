export class Solution {
    kthLuckyNumber(k: number): string {
        const bits = k.toString(2).slice(1);
        return [...bits].map((b) => (b === '0' ? '4' : '7')).join('');
    }
}

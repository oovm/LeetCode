export class Solution {
    truncateSentence(s: string, k: number): string {
        return s.trim().split(/\s+/).slice(0, k).join(' ');
    }
}

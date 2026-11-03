export class Solution {
    findTheDifference(s: string, t: string): string {
        let diff = 0;
        for (let i = 0; i < t.length; i++) {
            diff += t.charCodeAt(i);
        }
        for (let i = 0; i < s.length; i++) {
            diff -= s.charCodeAt(i);
        }
        return String.fromCharCode(diff);
    }
}

export class Solution {
    finalString(s: string): string {
        let out: string[] = [];
        for (const ch of s) {
            if (ch === 'i') {
                out.reverse();
            } else {
                out.push(ch);
            }
        }
        return out.join('');
    }
}

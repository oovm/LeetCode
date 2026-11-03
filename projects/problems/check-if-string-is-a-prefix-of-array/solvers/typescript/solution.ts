export class Solution {
    isPrefixString(s: string, words: string[]): boolean {
        let built = "";
        for (const word of words) {
            built += word;
            if (built === s) return true;
            if (built.length > s.length) return false;
        }
        return false;
    }
}

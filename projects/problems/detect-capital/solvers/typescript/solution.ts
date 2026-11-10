export class Solution {
    detectCapitalUse(word: string): boolean {
        const upper = word.replace(/[^A-Z]/g, "").length;
        const total = word.length;
        if (upper === total || upper === 0) return true;
        return upper === 1 && word[0] === word[0].toUpperCase();
    }
}

export class Solution {
    reverseOnlyLetters(s: string): string {
        const chars = s.split('');
        const isLetter = (c: string): boolean => /[a-zA-Z]/.test(c);
        let i = 0;
        let j = chars.length - 1;
        while (i < j) {
            if (!isLetter(chars[i])) i += 1;
            else if (!isLetter(chars[j])) j -= 1;
            else {
                [chars[i], chars[j]] = [chars[j], chars[i]];
                i += 1;
                j -= 1;
            }
        }
        return chars.join('');
    }
}

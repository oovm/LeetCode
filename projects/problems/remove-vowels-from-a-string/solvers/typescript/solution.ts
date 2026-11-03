export class Solution {
    removeVowels(s: string): string {
        return [...s].filter((ch) => !'aeiou'.includes(ch)).join('');
    }
}

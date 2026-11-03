export class Solution {
    uniqueMorseRepresentations(words: string[]): number {
        const codes = [
            ".-", "-...", "-.-.", "-..", ".", "..-.", "--.", "....", "..",
            ".---", "-.-", ".-..", "--", "-.", "---", ".--.", "--.-", ".-.",
            "...", "-", "..-", "...-", ".--", "-..-", "-.--", "--..",
        ];
        const seen = new Set<string>();
        for (const word of words) {
            let code = "";
            for (const c of word) code += codes[c.charCodeAt(0) - 97];
            seen.add(code);
        }
        return seen.size;
    }
}

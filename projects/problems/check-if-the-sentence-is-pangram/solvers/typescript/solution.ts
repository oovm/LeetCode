export class Solution {
    checkIfPangram(sentence: string): boolean {
        let mask = 0;
        for (const ch of sentence) {
            mask |= 1 << (ch.charCodeAt(0) - 97);
        }
        return mask === (1 << 26) - 1;
    }
}

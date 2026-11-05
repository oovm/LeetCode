export class Solution {
    findAndReplacePattern(words: string[], pattern: string): string[] {
        return words.filter((word) => this.sameShape(word, pattern));
    }

    private sameShape(word: string, pattern: string): boolean {
        const length = Math.min(word.length, pattern.length);
        const forward = new Array<number>(128).fill(0);
        const backward = new Array<number>(128).fill(0);
        for (let index = 0; index < length; index++) {
            const left = word.charCodeAt(index);
            const right = pattern.charCodeAt(index);
            if (forward[left] !== backward[right]) {
                return false;
            }
            forward[left] = index + 1;
            backward[right] = index + 1;
        }
        return true;
    }
}

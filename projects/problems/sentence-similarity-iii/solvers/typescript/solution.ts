export class Solution {
    areSentencesSimilar(sentence1: string, sentence2: string): boolean {
        let a = sentence1.split(' ');
        let b = sentence2.split(' ');
        if (a.length > b.length) {
            [a, b] = [b, a];
        }
        let left = 0;
        while (left < a.length && a[left] === b[left]) {
            left += 1;
        }
        let right = 0;
        while (right < a.length - left && a[a.length - 1 - right] === b[b.length - 1 - right]) {
            right += 1;
        }
        return left + right === a.length;
    }
}

export class Solution {
    pushDominoes(dominoes: string): string {
        const chars = ('L' + dominoes + 'R').split('');
        let i = 0;
        for (let j = 1; j < chars.length; j++) {
            if (chars[j] !== '.') {
                const span = j - i - 1;
                if (chars[i] === 'R' && chars[j] === 'L') {
                    for (let x = 1; x <= Math.floor(span / 2); x++) {
                        chars[i + x] = 'R';
                        chars[j - x] = 'L';
                    }
                } else if (chars[i] === chars[j]) {
                    for (let x = 1; x <= span; x++) {
                        chars[i + x] = chars[i];
                    }
                }
                i = j;
            }
        }
        return chars.slice(1, -1).join('');
    }
}

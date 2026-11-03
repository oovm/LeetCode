export class Solution {
    clearStars(s: string): string {
        const stacks: number[][] = Array.from({ length: 26 }, () => []);
        const removed = new Array<boolean>(s.length).fill(false);
        for (let i = 0; i < s.length; i++) {
            if (s[i] === '*') {
                removed[i] = true;
                for (let c = 0; c < 26; c++) {
                    if (stacks[c].length > 0) {
                        removed[stacks[c].pop()!] = true;
                        break;
                    }
                }
            } else {
                stacks[s.charCodeAt(i) - 97].push(i);
            }
        }
        return s
            .split('')
            .filter((_, i) => !removed[i])
            .join('');
    }
}

export class Solution {
    modifyString(s: string): string {
        const chars = s.split('');
        for (let i = 0; i < chars.length; i++) {
            if (chars[i] === '?') {
                for (const candidate of ['a', 'b', 'c']) {
                    if (candidate !== chars[i - 1] && candidate !== chars[i + 1]) {
                        chars[i] = candidate;
                        break;
                    }
                }
            }
        }
        return chars.join('');
    }
}

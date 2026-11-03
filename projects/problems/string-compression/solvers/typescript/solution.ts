export class Solution {
    compress(chars: string[]): number {
        let write = 0;
        let i = 0;
        while (i < chars.length) {
            let j = i;
            while (j < chars.length && chars[j] === chars[i]) j++;
            chars[write++] = chars[i];
            if (j - i > 1) {
                for (const d of String(j - i)) chars[write++] = d;
            }
            i = j;
        }
        return write;
    }
}

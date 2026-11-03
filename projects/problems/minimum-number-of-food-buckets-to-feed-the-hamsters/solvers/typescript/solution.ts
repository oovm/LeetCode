export class Solution {
    minimumBuckets(hamsters: string): number {
        const chars = hamsters.split('');
        let buckets = 0;
        for (let i = 0; i < chars.length; i++) {
            if (chars[i] === 'H') {
                if (chars[i - 1] === 'B') continue;
                if (chars[i + 1] === '.') {
                    buckets += 1;
                    chars[i + 1] = 'B';
                } else if (chars[i - 1] === '.') {
                    buckets += 1;
                    chars[i - 1] = 'B';
                } else {
                    return -1;
                }
            }
        }
        return buckets;
    }
}

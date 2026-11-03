export class Solution {
    findMinimumOperations(s1: string, s2: string, s3: string): number {
        let prefix = 0;
        const limit = Math.min(s1.length, s2.length, s3.length);
        while (prefix < limit && s1[prefix] === s2[prefix] && s2[prefix] === s3[prefix]) {
            prefix += 1;
        }
        if (prefix === 0) {
            if (s1.length + s2.length + s3.length === 0) {
                return 0;
            }
            return -1;
        }
        return s1.length + s2.length + s3.length - 3 * prefix;
    }
}

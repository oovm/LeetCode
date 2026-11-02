export class Solution {
    firstUniqChar(s: string): number {
        const counts = new Map<number, number>();
        for (let i = 0; i < s.length; i += 1) {
            const key = s.charCodeAt(i);
            counts.set(key, (counts.get(key) ?? 0) + 1);
        }
        for (let j = 0; j < s.length; j += 1) {
            if (counts.get(s.charCodeAt(j)) === 1) {
                return j;
            }
        }
        return -1;
    }
}

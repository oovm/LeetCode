export class Solution {
    areNumbersAscending(s: string): boolean {
        let prev = -1;
        for (const token of s.split(' ')) {
            if (/^\d+$/.test(token)) {
                const value = Number(token);
                if (value <= prev) {
                    return false;
                }
                prev = value;
            }
        }
        return true;
    }
}

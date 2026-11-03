export class Solution {
    countKeyChanges(s: string): number {
        let changes = 0;
        for (let i = 1; i < s.length; i++) {
            if (s[i].toLowerCase() !== s[i - 1].toLowerCase()) {
                changes += 1;
            }
        }
        return changes;
    }
}

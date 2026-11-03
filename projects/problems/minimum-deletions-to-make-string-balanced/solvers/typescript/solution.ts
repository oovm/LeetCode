export class Solution {
    minimumDeletions(s: string): number {
        let bCount = 0;
        let deletions = 0;
        for (const ch of s) {
            if (ch === 'b') bCount += 1;
            else if (bCount > 0) {
                deletions += 1;
                bCount -= 1;
            }
        }
        return deletions;
    }
}

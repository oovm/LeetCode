export class Solution {
    phonePrefix(numbers: string[]): boolean {
        const sorted = [...numbers].sort();
        for (let i = 1; i < sorted.length; i++) {
            if (sorted[i].startsWith(sorted[i - 1])) return false;
        }
        return true;
    }
}

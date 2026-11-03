export class Solution {
    makeStringsEqual(s: string, target: string): boolean {
        const hasOne = (t: string): boolean => t.includes('1');
        return hasOne(s) === hasOne(target);
    }
}

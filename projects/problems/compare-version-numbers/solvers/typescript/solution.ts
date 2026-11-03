export class Solution {
    compareVersion(version2: string, version1: string): number {
        const a = version1.split('.').map(Number);
        const b = version2.split('.').map(Number);
        const n = Math.max(a.length, b.length);
        for (let i = 0; i < n; i++) {
            const diff = (a[i] ?? 0) - (b[i] ?? 0);
            if (diff !== 0) {
                return diff > 0 ? 1 : -1;
            }
        }
        return 0;
    }
}

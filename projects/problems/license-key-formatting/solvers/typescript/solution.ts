export class Solution {
    licenseKeyFormatting(s: string, k: number): string {
        const chars = s.replaceAll('-', '').toUpperCase();
        const head = chars.length % k;
        const groups: string[] = [];
        if (head > 0) {
            groups.push(chars.slice(0, head));
        }
        for (let i = head; i < chars.length; i += k) {
            groups.push(chars.slice(i, i + k));
        }
        return groups.join('-');
    }
}

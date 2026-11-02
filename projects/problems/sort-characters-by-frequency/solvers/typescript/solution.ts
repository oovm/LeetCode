export class Solution {
    frequencySort(s: string): string {
        const counts = new Map<string, number>();
        for (const ch of s) {
            counts.set(ch, (counts.get(ch) ?? 0) + 1);
        }
        return [...counts.entries()]
            .sort((a, b) => b[1] - a[1])
            .map(([ch, n]) => ch.repeat(n))
            .join('');
    }
}

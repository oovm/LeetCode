export class Solution {
    smallestEquivalentString(s1: string, s2: string, baseStr: string): string {
        const parent = Array.from({ length: 26 }, (_, i) => i);
        const find = (x: number): number => {
            while (parent[x] !== x) {
                parent[x] = parent[parent[x]];
                x = parent[x];
            }
            return x;
        };
        for (let i = 0; i < s1.length; i++) {
            const a = find(s1.charCodeAt(i) - 97);
            const b = find(s2.charCodeAt(i) - 97);
            if (a !== b) {
                parent[Math.max(a, b)] = Math.min(a, b);
            }
        }
        return [...baseStr].map((ch) => String.fromCharCode(97 + find(ch.charCodeAt(0) - 97))).join('');
    }
}

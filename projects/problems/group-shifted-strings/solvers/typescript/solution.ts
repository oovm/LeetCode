export class Solution {
    groupStrings(strings: string[]): string[][] {
        const groups = new Map<string, string[]>();
        for (const s of strings) {
            const base = s.charCodeAt(0);
            const key = [...s].map((ch) => String((ch.charCodeAt(0) - base + 26) % 26)).join(",");
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key)!.push(s);
        }
        return [...groups.values()];
    }
}

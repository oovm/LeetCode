export class Solution {
    groupAnagrams(strs: string[]): string[][] {
        const groups = new Map<string, string[]>();
        for (const s of strs) {
            const key = [...s].sort().join("");
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key)!.push(s);
        }
        return [...groups.values()];
    }
}

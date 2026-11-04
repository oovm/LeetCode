export class Solution {
    findRepeatedDnaSequences(s: string): string[] {
        const result: string[] = [];
        const seen = new Set<string>();
        const emitted = new Set<string>();
        for (let start = 0; start + 10 <= s.length; start++) {
            const window = s.substring(start, start + 10);
            if (seen.has(window)) {
                if (!emitted.has(window)) {
                    emitted.add(window);
                    result.push(window);
                }
            } else {
                seen.add(window);
            }
        }
        return result;
    }
}

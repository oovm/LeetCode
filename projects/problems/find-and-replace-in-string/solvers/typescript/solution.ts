export class Solution {
    findReplaceString(s: string, indices: number[], sources: string[], targets: string[]): string {
        const owner = new Array<number>(s.length).fill(-1);
        for (let entry = 0; entry < indices.length; entry++) {
            const start = indices[entry];
            if (start < s.length && s.startsWith(sources[entry], start)) {
                owner[start] = entry;
            }
        }
        const out: string[] = [];
        let cursor = 0;
        while (cursor < s.length) {
            const slot = owner[cursor];
            if (slot >= 0) {
                out.push(targets[slot]);
                cursor += sources[slot].length;
            } else {
                out.push(s[cursor]);
                cursor++;
            }
        }
        return out.join('');
    }
}

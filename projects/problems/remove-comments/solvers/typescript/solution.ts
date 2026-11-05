export class Solution {
    removeComments(source: string[]): string[] {
        const out: string[] = [];
        let current = '';
        let inBlock = false;
        for (const line of source) {
            let cursor = 0;
            while (cursor < line.length) {
                if (inBlock) {
                    if (line.startsWith('*/', cursor)) {
                        inBlock = false;
                        cursor += 2;
                    } else {
                        cursor++;
                    }
                } else if (line.startsWith('//', cursor)) {
                    cursor = line.length;
                } else if (line.startsWith('/*', cursor)) {
                    inBlock = true;
                    cursor += 2;
                } else {
                    current += line[cursor];
                    cursor++;
                }
            }
            if (!inBlock) {
                if (current.length > 0) {
                    out.push(current);
                }
                current = '';
            }
        }
        return out;
    }
}

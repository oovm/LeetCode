export class Solution {
    decodeMessage(key: string, message: string): string {
        const table = new Map<string, string>([[' ', ' ']]);
        let next = 97;
        for (const ch of key) {
            if (!table.has(ch)) {
                table.set(ch, String.fromCharCode(next));
                next++;
            }
        }
        return [...message]
            .map((ch) => {
                const mapped = table.get(ch);
                if (mapped === undefined) {
                    throw new Error(`'${ch}'`);
                }
                return mapped;
            })
            .join('');
    }
}

export class Solution {
    subdomainVisits(cpdomains: string[]): string[] {
        const totals = new Map<string, number>();
        for (const entry of cpdomains) {
            const space = entry.indexOf(' ');
            const value = Number(entry.slice(0, space));
            for (let position = space; position < entry.length; position++) {
                const character = entry[position];
                if (character === ' ' || character === '.') {
                    const piece = entry.slice(position + 1);
                    totals.set(piece, (totals.get(piece) ?? 0) + value);
                }
            }
        }
        const out: string[] = [];
        for (const [piece, value] of totals) {
            out.push(`${value} ${piece}`);
        }
        return out;
    }
}

export class Solution {
    generateAbbreviations(word: string): string[] {
        const result: string[] = [];
        const visit = (position: number, current: string): void => {
            if (position >= word.length) {
                result.push(current);
                return;
            }
            visit(position + 1, current + word[position]);
            for (let stop = position + 1; stop <= word.length; stop++) {
                const piece = String(stop - position) + (stop < word.length ? word[stop] : "");
                visit(stop + 1, current + piece);
            }
        };
        visit(0, "");
        return result;
    }
}

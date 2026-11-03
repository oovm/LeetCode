export class Solution {
    alphabetBoardPath(target: string): string {
        const pos = (ch: string): [number, number] => {
            const idx = ch.charCodeAt(0) - 97;
            return [Math.floor(idx / 5), idx % 5];
        };
        const out: string[] = [];
        let [r, c] = [0, 0];
        for (const ch of target) {
            const [nr, nc] = pos(ch);
            if (ch === 'z') {
                out.push('U'.repeat(r - nr));
            }
            out.push('R'.repeat(Math.max(0, nc - c)));
            out.push('L'.repeat(Math.max(0, c - nc)));
            out.push('D'.repeat(Math.max(0, nr - r)));
            if (ch !== 'z') {
                out.push('U'.repeat(Math.max(0, r - nr)));
            }
            out.push('!');
            [r, c] = [nr, nc];
        }
        return out.join('');
    }
}

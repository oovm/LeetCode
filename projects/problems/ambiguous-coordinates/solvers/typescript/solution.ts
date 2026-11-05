export class Solution {
    ambiguousCoordinates(s: string): string[] {
        const digits = s.slice(1, -1);
        const out: string[] = [];
        for (let split = 1; split < digits.length; split++) {
            for (const left of this.pieces(digits, 0, split)) {
                for (const right of this.pieces(digits, split, digits.length)) {
                    out.push(`(${left}, ${right})`);
                }
            }
        }
        return out;
    }

    private pieces(text: string, start: number, stop: number): string[] {
        const out: string[] = [];
        const span = stop - start;
        for (let cut = 1; cut <= span; cut++) {
            const left = text.slice(start, start + cut);
            const right = text.slice(start + cut, stop);
            const leftOk = left === '0' || left[0] !== '0';
            const rightOk = right.length === 0 || right[right.length - 1] !== '0';
            if (leftOk && rightOk) {
                out.push(left + (cut < span ? '.' : '') + right);
            }
        }
        return out;
    }
}

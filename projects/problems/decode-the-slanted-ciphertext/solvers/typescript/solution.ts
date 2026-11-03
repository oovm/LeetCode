export class Solution {
    decodeCiphertext(rows: number, encodedText: string): string {
        const cols = encodedText.length / rows;
        const out: string[] = [];
        for (let start = 0; start < cols; start++) {
            for (let r = 0; r < rows && start + r < cols; r++) {
                out.push(encodedText[r * cols + start + r]);
            }
        }
        return out.join('').replace(/\s+$/, '');
    }
}

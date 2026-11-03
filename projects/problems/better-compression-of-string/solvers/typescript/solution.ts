export class Solution {
    betterCompression(compressed: string): string {
        const counts = new Array<number>(26).fill(0);
        let i = 0;
        while (i < compressed.length) {
            const ch = compressed[i];
            let value = 0;
            let j = i + 1;
            while (j < compressed.length && compressed[j] >= '0' && compressed[j] <= '9') {
                value = value * 10 + (compressed.charCodeAt(j) - 48);
                j += 1;
            }
            counts[ch.charCodeAt(0) - 97] += value;
            i = j;
        }
        const out: string[] = [];
        for (let c = 0; c < 26; c++) {
            if (counts[c] > 0) {
                out.push(`${String.fromCharCode(97 + c)}${counts[c]}`);
            }
        }
        return out.join('');
    }
}

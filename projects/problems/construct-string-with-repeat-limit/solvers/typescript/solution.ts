export class Solution {
    repeatLimitedString(s: string, repeatLimit: number): string {
        const counts = new Array<number>(26).fill(0);
        for (const ch of s) {
            counts[ch.charCodeAt(0) - 97] += 1;
        }
        const out: string[] = [];
        let i = 25;
        while (i >= 0) {
            if (counts[i] === 0) {
                i -= 1;
                continue;
            }
            const take = Math.min(repeatLimit, counts[i]);
            out.push(String.fromCharCode(97 + i).repeat(take));
            counts[i] -= take;
            if (counts[i] > 0) {
                let j = i - 1;
                while (j >= 0 && counts[j] === 0) j -= 1;
                if (j < 0) break;
                out.push(String.fromCharCode(97 + j));
                counts[j] -= 1;
            }
        }
        return out.join('');
    }
}

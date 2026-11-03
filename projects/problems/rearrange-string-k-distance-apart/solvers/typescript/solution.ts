export class Solution {
    rearrangeString(s: string, k: number): string {
        if (k === 0) return s;
        const counts = new Array<number>(26).fill(0);
        for (const ch of s) counts[ch.charCodeAt(0) - 97] += 1;
        const out: string[] = [];
        for (let pos = 0; pos < s.length; pos++) {
            let picked = -1;
            for (let c = 25; c >= 0; c--) {
                if (counts[c] > 0 && (pos < k || out[pos - k] !== String.fromCharCode(97 + c))) {
                    if (picked === -1 || counts[c] > counts[picked]) picked = c;
                }
            }
            if (picked === -1) return '';
            out.push(String.fromCharCode(97 + picked));
            counts[picked] -= 1;
        }
        return out.join('');
    }
}

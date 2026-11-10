export class Solution {
    diStringMatch(s: string): number[] {
        let low = 0;
        let high = s.length;
        const out: number[] = [];
        for (const ch of s) {
            if (ch === "D") {
                out.push(high);
                high--;
            } else {
                out.push(low);
                low++;
            }
        }
        out.push(low);
        return out;
    }
}

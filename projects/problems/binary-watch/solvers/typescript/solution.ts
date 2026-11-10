export class Solution {
    readBinaryWatch(turnedOn: number): string[] {
        const pop = (x: number): number => {
            let c = 0;
            let v = x;
            while (v > 0) {
                c += v & 1;
                v >>= 1;
            }
            return c;
        };
        const out: string[] = [];
        for (let h = 0; h < 12; h++) {
            for (let m = 0; m < 60; m++) {
                if (pop(h) + pop(m) === turnedOn) {
                    out.push(`${h}:${m.toString().padStart(2, "0")}`);
                }
            }
        }
        return out;
    }
}

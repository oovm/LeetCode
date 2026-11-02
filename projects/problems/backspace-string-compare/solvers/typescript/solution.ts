function nextValid(s: string, from: number): number {
    let i = from;
    let skip = 0;
    while (i >= 0) {
        if (s.charCodeAt(i) === 35) {
            skip += 1;
            i -= 1;
        } else if (skip > 0) {
            skip -= 1;
            i -= 1;
        } else {
            return i;
        }
    }
    return -1;
}

export class Solution {
    backspaceCompare(s: string, t: string): boolean {
        let i = s.length - 1;
        let j = t.length - 1;
        for (;;) {
            const a = nextValid(s, i);
            const b = nextValid(t, j);
            if (a < 0 && b < 0) {
                return true;
            }
            if (a < 0 || b < 0) {
                return false;
            }
            if (s.charCodeAt(a) !== t.charCodeAt(b)) {
                return false;
            }
            i = a - 1;
            j = b - 1;
        }
    }
}

export class Solution {
    isDecomposable(s: string): boolean {
        let twos = 0;
        let i = 0;
        while (i < s.length) {
            let run = 1;
            while (i + run < s.length && s[i + run] === s[i]) {
                run += 1;
            }
            if (run % 3 === 1) {
                return false;
            }
            if (run % 3 === 2) {
                twos += 1;
                if (twos > 1) {
                    return false;
                }
            }
            i += run;
        }
        return twos === 1;
    }
}

export class Solution {
    countQuadruples(firstString: string, secondString: string): number {
        const n = firstString.length;
        const m = secondString.length;
        for (let d = 0; d < 26; d++) {
            let count = 0;
            for (let i0 = 0; i0 < n; i0++) {
                for (let j0 = 0; j0 < m; j0++) {
                    if (i0 > 0 && j0 > 0) {
                        continue;
                    }
                    let run = 0;
                    for (let i = i0, j = j0; i < n && j < m; i++, j++) {
                        if (firstString.charCodeAt(i) - secondString.charCodeAt(j) === d) {
                            run += 1;
                        } else {
                            count += (run * (run + 1)) / 2;
                            run = 0;
                        }
                    }
                    count += (run * (run + 1)) / 2;
                }
            }
            if (count > 0) {
                return count;
            }
        }
        return 0;
    }
}

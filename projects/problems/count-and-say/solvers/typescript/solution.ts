export class Solution {
    countAndSay(n: number): string {
        let current = '1';
        for (let round = 1; round < n; round++) {
            let next = '';
            let i = 0;
            while (i < current.length) {
                let run = 1;
                while (i + run < current.length && current[i + run] === current[i]) {
                    run += 1;
                }
                next += `${run}${current[i]}`;
                i += run;
            }
            current = next;
        }
        return current;
    }
}

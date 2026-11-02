export class Solution {
    countVowelStrings(n: number): number {
        let va = 1;
        let ve = 1;
        let vi = 1;
        let vo = 1;
        let vu = 1;
        for (let step = 1; step < n; step += 1) {
            ve += va;
            vi += ve;
            vo += vi;
            vu += vo;
        }
        return va + ve + vi + vo + vu;
    }
}

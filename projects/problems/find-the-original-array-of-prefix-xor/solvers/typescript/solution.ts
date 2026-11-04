export class Solution {
    findArray(pref: number[]): number[] {
        const result: number[] = [];
        for (let i = 0; i < pref.length; i++) {
            result.push(i === 0 ? pref[0] : pref[i] ^ pref[i - 1]);
        }
        return result;
    }
}

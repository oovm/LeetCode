export class Solution {
    checkInclusion(s1: string, s2: string): boolean {
        if (s1.length > s2.length) {
            return false;
        }
        const need = new Array<number>(26).fill(0);
        const window = new Array<number>(26).fill(0);
        for (let i = 0; i < s1.length; i++) {
            need[s1.charCodeAt(i) - 97] += 1;
            window[s2.charCodeAt(i) - 97] += 1;
        }
        const equal = (): boolean => need.every((v, i) => v === window[i]);
        for (let i = s1.length; i < s2.length; i++) {
            if (equal()) {
                return true;
            }
            window[s2.charCodeAt(i) - 97] += 1;
            window[s2.charCodeAt(i - s1.length) - 97] -= 1;
        }
        return equal();
    }
}

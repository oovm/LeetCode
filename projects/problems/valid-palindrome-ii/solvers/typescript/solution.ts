function palRange(s: string, lo: number, hi: number): boolean {
    let i = lo;
    let j = hi;
    while (i < j) {
        if (s.charCodeAt(i) !== s.charCodeAt(j)) {
            return false;
        }
        i += 1;
        j -= 1;
    }
    return true;
}

export class Solution {
    validPalindrome(s: string): boolean {
        let i = 0;
        let j = s.length - 1;
        while (i < j) {
            if (s.charCodeAt(i) !== s.charCodeAt(j)) {
                return palRange(s, i + 1, j) || palRange(s, i, j - 1);
            }
            i += 1;
            j -= 1;
        }
        return true;
    }
}

export class Solution {
    queryString(s: string, n: number): boolean {
        for (let v = 1; v <= n; v++) {
            if (!s.includes(v.toString(2))) {
                return false;
            }
        }
        return true;
    }
}

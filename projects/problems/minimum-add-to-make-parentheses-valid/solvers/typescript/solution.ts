export class Solution {
    minAddToMakeValid(s: string): number {
        let open = 0;
        let needed = 0;
        for (const ch of s) {
            if (ch === '(') open += 1;
            else if (open > 0) open -= 1;
            else needed += 1;
        }
        return needed + open;
    }
}

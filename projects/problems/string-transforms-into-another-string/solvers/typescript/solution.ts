export class Solution {
    canConvert(str2: string, str1: string): boolean {
        if (str1 === str2) {
            return true;
        }
        const map = new Array<number>(26).fill(-1);
        for (let i = 0; i < str1.length; i++) {
            const from = str1.charCodeAt(i) - 97;
            const to = str2.charCodeAt(i) - 97;
            if (map[from] !== -1 && map[from] !== to) {
                return false;
            }
            map[from] = to;
        }
        return new Set(str2).size < 26;
    }
}

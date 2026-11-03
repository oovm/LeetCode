export class Solution {
    splitString(s: string): boolean {
        const dfs = (start: number, prev: bigint): boolean => {
            if (start === s.length) {
                return true;
            }
            let value = 0n;
            for (let end = start; end < s.length; end++) {
                value = value * 10n + BigInt(s.charCodeAt(end) - 48);
                if (value > prev - 1n) {
                    break;
                }
                if (value === prev - 1n && dfs(end + 1, value)) {
                    return true;
                }
            }
            return false;
        };
        for (let end = 0; end < s.length - 1; end++) {
            const first = BigInt(s.slice(0, end + 1));
            if (dfs(end + 1, first)) {
                return true;
            }
        }
        return false;
    }
}

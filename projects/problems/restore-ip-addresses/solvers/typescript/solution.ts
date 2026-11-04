export class Solution {
    restoreIpAddresses(s: string): string[] {
        const result: string[] = [];
        if (s.length < 4 || s.length > 12) return result;

        const segments: string[] = [];

        const isValid = (start: number, length: number): boolean => {
            if (length === 0) return false;
            if (length > 1 && s[start] === "0") return false;
            const value = Number(s.slice(start, start + length));
            return value <= 255;
        };

        const walk = (index: number): void => {
            if (segments.length === 4) {
                if (index === s.length) result.push(segments.join("."));
                return;
            }
            for (let length = 1; length <= 3; length++) {
                if (index + length > s.length) break;
                if (!isValid(index, length)) continue;
                segments.push(s.slice(index, index + length));
                walk(index + length);
                segments.pop();
            }
        };

        walk(0);
        return result;
    }
}

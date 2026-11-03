export class Solution {
    numberOfRounds(loginTime: string, logoutTime: string): number {
        const parse = (t: string): number => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
        let start = parse(loginTime);
        let end = parse(logoutTime);
        if (end < start) {
            end += 1440;
        }
        return Math.max(0, Math.floor(end / 15) - Math.ceil(start / 15));
    }
}

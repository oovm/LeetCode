export class Solution {
    findContestMatch(n: number): string {
        let teams = Array.from({ length: n }, (_, i) => String(i + 1));
        while (teams.length > 1) {
            const next: string[] = [];
            for (let i = 0; i < teams.length / 2; i++) {
                next.push(`(${teams[i]},${teams[teams.length - 1 - i]})`);
            }
            teams = next;
        }
        return teams[0];
    }
}

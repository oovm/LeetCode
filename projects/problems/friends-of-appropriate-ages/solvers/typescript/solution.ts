export class Solution {
    numFriendRequests(ages: number[]): number {
        const counts = new Array<number>(121).fill(0);
        for (const age of ages) {
            counts[age]++;
        }
        let total = 0;
        for (let younger = 0; younger <= 120; younger++) {
            for (let older = 0; older <= 120; older++) {
                if (older * 2 <= younger + 14 || older > younger || (older > 100 && younger < 100)) {
                    continue;
                }
                const duplicate = younger === older ? 1 : 0;
                total += counts[younger] * (counts[older] - duplicate);
            }
        }
        return total;
    }
}

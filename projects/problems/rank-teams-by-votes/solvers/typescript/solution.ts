export class Solution {
    rankTeams(votes: string[]): string {
        const width = votes[0].length;
        const letters = votes[0].split("");
        const slot = new Map<string, number>();
        const ranks: number[][] = [];
        for (let index = 0; index < width; index++) {
            slot.set(letters[index], index);
            ranks.push(new Array(width).fill(0));
        }

        for (const vote of votes) {
            for (let seat = 0; seat < width; seat++) {
                ranks[slot.get(vote[seat])!][seat]++;
            }
        }

        const order = letters.map((_, index) => index);
        order.sort((left, right) => {
            for (let seat = 0; seat < width; seat++) {
                if (ranks[left][seat] !== ranks[right][seat]) {
                    return ranks[right][seat] - ranks[left][seat];
                }
            }
            return letters[left].localeCompare(letters[right]);
        });

        return order.map((index) => letters[index]).join("");
    }
}

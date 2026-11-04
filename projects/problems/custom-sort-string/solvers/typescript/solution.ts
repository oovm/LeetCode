export class Solution {
    customSortString(order: string, s: string): string {
        const rank = new Map<string, number>();
        let position = 0;
        for (const character of order) rank.set(character, position++);
        return [...s]
            .sort((left, right) => (rank.get(left) ?? 0) - (rank.get(right) ?? 0))
            .join("");
    }
}

export class Solution {
    maximumInvitations(grid: number[][]): number {
        const rows = grid.length;
        const cols = grid[0].length;
        const matchedTable = new Array<number>(cols).fill(-1);

        const findAugmenting = (person: number, visited: Set<number>): boolean => {
            for (let table = 0; table < cols; table++) {
                if (grid[person][table] !== 1 || visited.has(table)) {
                    continue;
                }
                visited.add(table);
                if (matchedTable[table] === -1 || findAugmenting(matchedTable[table], visited)) {
                    matchedTable[table] = person;
                    return true;
                }
            }
            return false;
        };

        let accepted = 0;
        for (let person = 0; person < rows; person++) {
            if (findAugmenting(person, new Set<number>())) {
                accepted++;
            }
        }
        return accepted;
    }
}

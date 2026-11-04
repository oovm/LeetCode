export class Solution {
    equationsPossible(equations: string[]): boolean {
        const parent = Array.from({ length: 26 }, (_, index) => index);
        const find = (x: number): number => {
            while (parent[x] !== x) {
                parent[x] = parent[parent[x]];
                x = parent[x];
            }
            return x;
        };
        const union = (a: number, b: number): void => {
            const rootA = find(a);
            const rootB = find(b);
            if (rootA !== rootB) parent[rootA] = rootB;
        };
        const letter = (text: string): number => text.charCodeAt(0) - 97;
        for (const equation of equations) {
            if (equation.includes("==")) {
                const [left, right] = equation.split("==");
                union(letter(left), letter(right));
            }
        }
        for (const equation of equations) {
            if (equation.includes("==")) continue;
            const [left, right] = equation.split("!=");
            if (find(letter(left)) === find(letter(right))) return false;
        }
        return true;
    }
}

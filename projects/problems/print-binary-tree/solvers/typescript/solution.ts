export class Solution {
    printTree(root: number[]): string[][] {
        const total = root.length;
        if (total === 0) {
            return [];
        }
        let height = 1;
        let capacity = 1;
        while (capacity < total) {
            capacity = capacity * 2 + 1;
            height++;
        }
        const width = capacity;
        const result: string[][] = [];
        for (let depth = 0; depth < height; depth++) {
            const row = new Array<string>(width).fill('');
            const step = 2 ** (height - depth);
            const offset = step / 2 - 1;
            const first = 2 ** depth - 1;
            const levelSize = 2 ** depth;
            for (let within = 0; within < levelSize && first + within < total; within++) {
                row[within * step + offset] = String(root[first + within]);
            }
            result.push(row);
        }
        return result;
    }
}

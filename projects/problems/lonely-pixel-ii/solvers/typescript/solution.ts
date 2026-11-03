export class Solution {
    findBlackPixel(picture: string[][], target: number): number {
        const m = picture.length;
        const n = picture[0].length;
        const rowCount = picture.map((row) => [...row].filter((c) => c === "B").length);
        const colCount = new Array<number>(n).fill(0);
        for (let j = 0; j < n; j++) {
            for (let i = 0; i < m; i++) if (picture[i][j] === "B") colCount[j]++;
        }
        const rowGroups = new Map<string, number>();
        for (let i = 0; i < m; i++) {
            if (rowCount[i] === target) {
                const key = picture[i].join("");
                rowGroups.set(key, (rowGroups.get(key) ?? 0) + 1);
            }
        }
        let count = 0;
        for (let j = 0; j < n; j++) {
            if (colCount[j] !== target) continue;
            for (let i = 0; i < m; i++) {
                if (
                    picture[i][j] === "B" &&
                    rowGroups.get(picture[i].join("")) === target &&
                    rowCount[i] === target
                ) {
                    count++;
                }
            }
        }
        return count;
    }
}

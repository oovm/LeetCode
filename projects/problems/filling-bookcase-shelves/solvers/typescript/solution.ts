export class Solution {
    minHeightShelves(books: number[][], shelfWidth: number): number {
        const count = books.length;
        const table = new Array<number>(count + 1).fill(0);
        for (let done = 1; done <= count; done++) {
            const [width, height] = books[done - 1];
            table[done] = table[done - 1] + height;
            let layerWidth = width;
            let layerHeight = height;
            for (let start = done - 1; start > 0; start--) {
                const at = start - 1;
                layerWidth += books[at][0];
                if (layerWidth > shelfWidth) {
                    break;
                }
                layerHeight = Math.max(layerHeight, books[at][1]);
                table[done] = Math.min(table[done], table[at] + layerHeight);
            }
        }
        return table[count];
    }
}

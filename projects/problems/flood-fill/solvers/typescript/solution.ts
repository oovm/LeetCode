export class Solution {
    floodFill(image: number[][], sr: number, sc: number, color: number): number[][] {
        const rows = image.length;
        const cols = image[0].length;
        const old = image[sr][sc];
        const dfs = (x: number, y: number): void => {
            image[x][y] = color;
            if (x > 0 && image[x - 1][y] === old) dfs(x - 1, y);
            if (x + 1 < rows && image[x + 1][y] === old) dfs(x + 1, y);
            if (y > 0 && image[x][y - 1] === old) dfs(x, y - 1);
            if (y + 1 < cols && image[x][y + 1] === old) dfs(x, y + 1);
        };
        if (old !== color) {
            dfs(sr, sc);
        }
        return image;
    }
}

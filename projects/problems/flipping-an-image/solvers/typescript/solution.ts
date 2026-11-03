export class Solution {
    flipAndInvertImage(image: number[][]): number[][] {
        return image.map((row) => [...row].reverse().map((v) => 1 - v));
    }
}

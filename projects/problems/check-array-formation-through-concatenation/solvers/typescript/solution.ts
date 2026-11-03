export class Solution {
    canFormArray(arr: number[], pieces: number[][]): boolean {
        const first = new Map<number, number[]>();
        for (const piece of pieces) first.set(piece[0], piece);
        let i = 0;
        while (i < arr.length) {
            const piece = first.get(arr[i]);
            if (!piece) return false;
            for (const v of piece) {
                if (arr[i] !== v) return false;
                i++;
            }
        }
        return true;
    }
}

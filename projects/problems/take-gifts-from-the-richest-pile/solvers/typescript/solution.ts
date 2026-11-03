export class Solution {
    pickGifts(gifts: number[], k: number): number {
        for (let t = 0; t < k; t++) {
            let best = 0;
            for (let i = 1; i < gifts.length; i++) {
                if (gifts[i] > gifts[best]) best = i;
            }
            gifts[best] = Math.floor(Math.sqrt(gifts[best]));
        }
        return gifts.reduce((a, b) => a + b, 0);
    }
}

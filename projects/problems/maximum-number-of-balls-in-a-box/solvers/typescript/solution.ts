export class Solution {
    countBalls(lowLimit: number, highLimit: number): number {
        const count = new Array<number>(46).fill(0);
        for (let x = lowLimit; x <= highLimit; x++) {
            let sum = 0;
            for (let r = x; r > 0; r = Math.floor(r / 10)) {
                sum += r % 10;
            }
            count[sum] = (count[sum] as number) + 1;
        }
        return Math.max(...count);
    }
}

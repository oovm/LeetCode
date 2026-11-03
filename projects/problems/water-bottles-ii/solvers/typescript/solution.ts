export class Solution {
    maxBottlesDrunk(numBottles: number, numExchange: number): number {
        let drunk = numBottles;
        let empty = numBottles;
        let rate = numExchange;
        while (empty >= rate) {
            empty -= rate;
            rate += 1;
            drunk += 1;
            empty += 1;
        }
        return drunk;
    }
}

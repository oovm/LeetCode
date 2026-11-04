export class Solution {
    deckRevealedIncreasing(deck: number[]): number[] {
        const sorted = [...deck].sort((a, b) => a - b);
        const order: number[] = [];
        for (let index = 0; index < sorted.length; index++) order.push(index);
        const result = new Array<number>(sorted.length).fill(0);
        for (const value of sorted) {
            result[order.shift()!] = value;
            if (order.length > 0) order.push(order.shift()!);
        }
        return result;
    }
}

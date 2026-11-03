export class Solution {
    lastStoneWeight(stones: number[]): number {
        const heap = [...stones].sort((a, b) => a - b);
        while (heap.length > 1) {
            const y = heap.pop()!;
            const x = heap.pop()!;
            if (y > x) {
                const diff = y - x;
                let i = heap.length;
                while (i > 0 && heap[i - 1] > diff) i--;
                heap.splice(i, 0, diff);
            }
        }
        return heap.length === 1 ? heap[0] : 0;
    }
}

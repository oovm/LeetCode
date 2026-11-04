class MaxHeap {
    private data: number[] = [];
    get size(): number { return this.data.length; }
    push(value: number): void {
        this.data.push(value);
        let i = this.data.length - 1;
        while (i > 0) {
            const parent = Math.floor((i - 1) / 2);
            if (this.data[parent] >= this.data[i]) break;
            [this.data[parent], this.data[i]] = [this.data[i], this.data[parent]];
            i = parent;
        }
    }
    pop(): number {
        const top = this.data[0];
        const last = this.data.pop() as number;
        if (this.data.length > 0) {
            this.data[0] = last;
            let i = 0;
            while (true) {
                const left = i * 2 + 1;
                const right = i * 2 + 2;
                let largest = i;
                if (left < this.data.length && this.data[left] > this.data[largest]) largest = left;
                if (right < this.data.length && this.data[right] > this.data[largest]) largest = right;
                if (largest === i) break;
                [this.data[i], this.data[largest]] = [this.data[largest], this.data[i]];
                i = largest;
            }
        }
        return top;
    }
}

export class Solution {
    furthestBuilding(heights: number[], bricks: number, ladders: number): number {
        const heap = new MaxHeap();
        let remaining = bricks;
        for (let i = 1; i < heights.length; i++) {
            const difference = heights[i] - heights[i - 1];
            if (difference > 0) {
                heap.push(-difference);
                if (heap.size > ladders) {
                    remaining -= -heap.pop();
                    if (remaining < 0) return i - 1;
                }
            }
        }
        return heights.length - 1;
    }
}

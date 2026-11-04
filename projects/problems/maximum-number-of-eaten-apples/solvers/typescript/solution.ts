class FruitHeap {
    private data: [number, number][] = [];
    get size(): number { return this.data.length; }
    peek(): [number, number] { return this.data[0]; }
    push(value: [number, number]): void {
        this.data.push(value);
        let i = this.data.length - 1;
        while (i > 0) {
            const parent = Math.floor((i - 1) / 2);
            if (this.data[parent][0] <= this.data[i][0]) break;
            [this.data[parent], this.data[i]] = [this.data[i], this.data[parent]];
            i = parent;
        }
    }
    pop(): [number, number] {
        const top = this.data[0];
        const last = this.data.pop() as [number, number];
        if (this.data.length > 0) {
            this.data[0] = last;
            let i = 0;
            while (true) {
                const left = i * 2 + 1;
                const right = i * 2 + 2;
                let smallest = i;
                if (left < this.data.length && this.data[left][0] < this.data[smallest][0]) smallest = left;
                if (right < this.data.length && this.data[right][0] < this.data[smallest][0]) smallest = right;
                if (smallest === i) break;
                [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];
                i = smallest;
            }
        }
        return top;
    }
}

export class Solution {
    eatenApples(apples: number[], days: number[]): number {
        const heap = new FruitHeap();
        let eaten = 0;
        let current = 0;
        while (current < apples.length || heap.size > 0) {
            if (current < apples.length && apples[current] > 0) {
                heap.push([current + days[current], apples[current]]);
            }
            while (heap.size > 0 && heap.peek()[0] <= current) heap.pop();
            if (heap.size > 0) {
                const top = heap.pop();
                eaten += 1;
                if (top[1] > 1) heap.push([top[0], top[1] - 1]);
            }
            current += 1;
        }
        return eaten;
    }
}

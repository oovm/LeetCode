class MinHeap {
    private data: number[] = [];
    get size(): number { return this.data.length; }
    peek(): number { return this.data[0]; }
    push(value: number): void {
        this.data.push(value);
        let i = this.data.length - 1;
        while (i > 0) {
            const parent = Math.floor((i - 1) / 2);
            if (this.data[parent] <= this.data[i]) break;
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
                let smallest = i;
                if (left < this.data.length && this.data[left] < this.data[smallest]) smallest = left;
                if (right < this.data.length && this.data[right] < this.data[smallest]) smallest = right;
                if (smallest === i) break;
                [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];
                i = smallest;
            }
        }
        return top;
    }
}

export class Solution {
    maxEvents(events: number[][]): number {
        const ordered = [...events].sort((a, b) => a[0] - b[0]);
        const heap = new MinHeap();
        let current = 0;
        let attended = 0;
        let index = 0;
        while (index < ordered.length || heap.size > 0) {
            if (heap.size === 0) current = Math.max(current, ordered[index][0]);
            while (index < ordered.length && ordered[index][0] <= current) {
                heap.push(ordered[index][1]);
                index += 1;
            }
            while (heap.size > 0 && heap.peek() < current) heap.pop();
            if (heap.size > 0) {
                heap.pop();
                attended += 1;
                current += 1;
            }
        }
        return attended;
    }
}

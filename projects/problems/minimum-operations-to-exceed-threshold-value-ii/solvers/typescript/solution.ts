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
    minOperations(nums: number[], k: number): number {
        const heap = new MinHeap();
        for (const value of nums) heap.push(value);
        let operations = 0;
        while (heap.size >= 2 && heap.peek() < k) {
            const first = heap.pop();
            const second = heap.pop();
            heap.push(Math.min(first, second) * 2 + Math.max(first, second));
            operations += 1;
        }
        return operations;
    }
}

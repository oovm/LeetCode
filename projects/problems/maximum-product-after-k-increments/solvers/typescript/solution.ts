class MinHeap {
    private data: number[] = [];
    get size(): number { return this.data.length; }
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
    maximumProduct(nums: number[], k: number): number {
        const modulo = 1000000007;
        const heap = new MinHeap();
        for (const value of nums) heap.push(value);
        for (let step = 0; step < k; step++) {
            const smallest = heap.pop();
            heap.push(smallest + 1);
        }
        let product = 1;
        while (heap.size > 0) product = (product * heap.pop()) % modulo;
        return product;
    }
}

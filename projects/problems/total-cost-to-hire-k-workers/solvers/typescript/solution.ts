class IndexHeap {
    private data: number[] = [];
    constructor(private readonly costs: number[]) {}
    private less(a: number, b: number): boolean {
        if (this.costs[a] !== this.costs[b]) return this.costs[a] < this.costs[b];
        return a < b;
    }
    get size(): number { return this.data.length; }
    push(index: number): void {
        this.data.push(index);
        let i = this.data.length - 1;
        while (i > 0) {
            const parent = Math.floor((i - 1) / 2);
            if (!this.less(this.data[i], this.data[parent])) break;
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
                if (left < this.data.length && this.less(this.data[left], this.data[smallest])) smallest = left;
                if (right < this.data.length && this.less(this.data[right], this.data[smallest])) smallest = right;
                if (smallest === i) break;
                [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];
                i = smallest;
            }
        }
        return top;
    }
}

export class Solution {
    totalCost(costs: number[], k: number, candidates: number): number {
        const heap = new IndexHeap(costs);
        const count = costs.length;
        let left = 0;
        let right = count;
        let added = 0;
        while (added < candidates && left < right) { heap.push(left); left += 1; added += 1; }
        added = 0;
        while (added < candidates && right > left) { right -= 1; heap.push(right); added += 1; }

        let total = 0;
        for (let hired = 0; hired < k; hired++) {
            const index = heap.pop();
            total += costs[index];
            if (index < left) {
                if (left < right) { heap.push(left); left += 1; }
            } else {
                if (right > left) { right -= 1; heap.push(right); }
            }
        }
        return total;
    }
}

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
    leastInterval(tasks: string[], n: number): number {
        const counts = new Map<string, number>();
        for (const task of tasks) counts.set(task, (counts.get(task) ?? 0) + 1);
        const heap = new MaxHeap();
        for (const value of counts.values()) heap.push(value);
        let time = 0;
        const window = n + 1;
        while (heap.size > 0) {
            const processed: number[] = [];
            let executed = 0;
            for (let cycle = 0; cycle < window && heap.size > 0; cycle++) {
                const remaining = heap.pop();
                if (remaining > 1) processed.push(remaining - 1);
                executed += 1;
            }
            for (const remaining of processed) heap.push(remaining);
            time += heap.size > 0 ? window : executed;
        }
        return time;
    }
}

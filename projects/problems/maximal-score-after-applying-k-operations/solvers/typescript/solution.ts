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
    maxKelements(nums: number[], k: number): number {
        const heap = new MaxHeap();
        for (const value of nums) heap.push(value);
        let score = 0;
        for (let step = 0; step < k; step++) {
            const top = heap.pop();
            score += top;
            heap.push(Math.ceil(top / 3));
        }
        return score;
    }
}

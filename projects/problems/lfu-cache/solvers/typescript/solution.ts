export class LFUCache {
    private readonly capacity: number;
    private readonly values = new Map<number, number>();
    private readonly freqs = new Map<number, number>();
    private readonly buckets = new Map<number, Map<number, number>>();
    private minFreq = 0;

    constructor(capacity: number) {
        this.capacity = capacity;
    }

    get(key: number): number {
        if (!this.values.has(key)) {
            return -1;
        }
        this.move(key, this.freqs.get(key)! + 1);
        return this.values.get(key)!;
    }

    put(key: number, value: number): void {
        if (this.capacity === 0) {
            return;
        }
        if (this.values.has(key)) {
            this.values.set(key, value);
            this.move(key, this.freqs.get(key)! + 1);
            return;
        }
        if (this.values.size >= this.capacity) {
            const bucket = this.buckets.get(this.minFreq)!;
            const victim = bucket.keys().next().value!;
            bucket.delete(victim);
            if (bucket.size === 0) {
                this.buckets.delete(this.minFreq);
            }
            this.values.delete(victim);
            this.freqs.delete(victim);
        }
        this.values.set(key, value);
        this.freqs.set(key, 1);
        this.bucketOf(1).set(key, value);
        this.minFreq = 1;
    }

    private bucketOf(freq: number): Map<number, number> {
        let bucket = this.buckets.get(freq);
        if (!bucket) {
            bucket = new Map<number, number>();
            this.buckets.set(freq, bucket);
        }
        return bucket;
    }

    private move(key: number, target: number): void {
        const current = this.freqs.get(key)!;
        const bucket = this.buckets.get(current)!;
        bucket.delete(key);
        if (bucket.size === 0) {
            this.buckets.delete(current);
            if (this.minFreq === current) {
                this.minFreq = target;
            }
        }
        this.freqs.set(key, target);
        // Map 保持插入顺序：尾部即桶内最近使用。
        this.bucketOf(target).set(key, this.values.get(key)!);
    }
}

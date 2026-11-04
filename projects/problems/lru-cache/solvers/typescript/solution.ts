export class LRUCache {
    private readonly capacity: number;
    private readonly slots = new Map<number, number>();

    constructor(capacity: number) {
        this.capacity = capacity;
    }

    get(key: number): number {
        if (!this.slots.has(key)) {
            return -1;
        }
        const value = this.slots.get(key)!;
        // Map 保持插入顺序：先删后写把该键挪到末尾，末尾即最近使用。
        this.slots.delete(key);
        this.slots.set(key, value);
        return value;
    }

    put(key: number, value: number): void {
        if (this.slots.has(key)) {
            this.slots.delete(key);
        } else if (this.slots.size >= this.capacity) {
            // 首个键即最久未使用。
            const oldest = this.slots.keys().next().value!;
            this.slots.delete(oldest);
        }
        this.slots.set(key, value);
    }
}

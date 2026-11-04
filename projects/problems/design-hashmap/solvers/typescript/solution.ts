export class MyHashMap {
    private readonly items = new Map<number, number>();

    put(key: number, value: number): void {
        this.items.set(key, value);
    }

    get(key: number): number {
        const value = this.items.get(key);
        return value === undefined ? -1 : value;
    }

    remove(key: number): void {
        this.items.delete(key);
    }
}

export class MyHashSet {
    private readonly items = new Set<number>();

    add(key: number): void {
        this.items.add(key);
    }

    remove(key: number): void {
        this.items.delete(key);
    }

    contains(key: number): boolean {
        return this.items.has(key);
    }
}

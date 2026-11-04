export class Counter {
    private value = 0;

    constructor(initial = 0) {
        this.value = initial;
    }

    add(delta: number): void {
        this.value += delta;
    }

    inc(): void {
        this.add(1);
    }

    reset(): void {
        this.value = 0;
    }

    get(): number {
        return this.value;
    }
}

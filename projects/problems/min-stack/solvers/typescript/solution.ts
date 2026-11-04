export class MinStack {
    private readonly values: number[] = [];
    private readonly minimums: number[] = [];

    push(value: number): void {
        const currentMin = this.minimums.length === 0 ? value : Math.min(value, this.minimums[this.minimums.length - 1]);
        this.values.push(value);
        this.minimums.push(currentMin);
    }

    pop(): void {
        this.values.pop();
        this.minimums.pop();
    }

    top(): number {
        return this.values[this.values.length - 1];
    }

    getMin(): number {
        return this.minimums[this.minimums.length - 1];
    }
}

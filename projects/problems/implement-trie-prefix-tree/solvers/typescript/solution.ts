export class Trie {
    private readonly children: Map<string, number>[] = [new Map<string, number>()];
    private readonly ends: boolean[] = [false];

    insert(word: string): void {
        let node = 0;
        for (const ch of word) {
            let next = this.children[node].get(ch);
            if (next === undefined) {
                next = this.children.length;
                this.children[node].set(ch, next);
                this.children.push(new Map<string, number>());
                this.ends.push(false);
            }
            node = next;
        }
        this.ends[node] = true;
    }

    search(word: string): boolean {
        const node = this.walk(word);
        return node !== -1 && this.ends[node];
    }

    startsWith(prefix: string): boolean {
        return this.walk(prefix) !== -1;
    }

    private walk(word: string): number {
        let node = 0;
        for (const ch of word) {
            const next = this.children[node].get(ch);
            if (next === undefined) {
                return -1;
            }
            node = next;
        }
        return node;
    }
}

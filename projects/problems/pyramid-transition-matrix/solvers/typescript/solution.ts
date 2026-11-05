export class Solution {
    pyramidTransition(bottom: string, allowed: string[]): boolean {
        const tops = new Map<string, string>();
        for (const rule of allowed) {
            const key = rule.slice(0, 2);
            tops.set(key, (tops.get(key) ?? '') + rule[2]);
        }
        const visited = new Set<string>();
        const queue: string[] = [bottom];
        let head = 0;
        while (head < queue.length) {
            const row = queue[head++];
            if (row.length === 1) {
                return true;
            }
            if (visited.has(row)) {
                continue;
            }
            visited.add(row);
            let expanded: string[] = [''];
            for (let position = 0; position + 1 < row.length; position++) {
                const options = tops.get(row.slice(position, position + 2)) ?? '';
                if (options.length === 0) {
                    expanded.length = 0;
                    break;
                }
                const next: string[] = [];
                for (const prefix of expanded) {
                    for (const character of options) {
                        next.push(prefix + character);
                    }
                }
                expanded = next;
            }
            for (const child of expanded) {
                queue.push(child);
            }
        }
        return false;
    }
}

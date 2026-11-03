export class Solution {
    kSimilarity(s1: string, s2: string): number {
        if (s1 === s2) return 0;
        const visited = new Set<string>([s1]);
        let queue = [s1];
        let steps = 0;
        while (queue.length > 0) {
            const next: string[] = [];
            for (const cur of queue) {
                if (cur === s2) return steps;
                let i = 0;
                while (cur[i] === s2[i]) i += 1;
                for (let j = i + 1; j < cur.length; j++) {
                    if (cur[j] === s2[i] && cur[j] !== s2[j]) {
                        const chars = cur.split('');
                        [chars[i], chars[j]] = [chars[j], chars[i]];
                        const state = chars.join('');
                        if (!visited.has(state)) {
                            visited.add(state);
                            next.push(state);
                        }
                    }
                }
            }
            queue = next;
            steps += 1;
        }
        return -1;
    }
}

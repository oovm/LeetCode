export class Solution {
    longestSubsequenceRepeatedK(s: string, k: number): string {
        const counts = new Map<string, number>();
        for (const ch of s) counts.set(ch, (counts.get(ch) ?? 0) + 1);
        const usable = [...counts.entries()]
            .filter(([, c]) => c >= k)
            .map(([ch]) => ch)
            .sort()
            .reverse();
        const isKSubseq = (pattern: string): boolean => {
            let idx = 0;
            let times = 0;
            for (const ch of s) {
                if (ch === pattern[idx]) {
                    idx += 1;
                    if (idx === pattern.length) {
                        idx = 0;
                        times += 1;
                        if (times === k) return true;
                    }
                }
            }
            return false;
        };
        const queue = [''];
        let best = '';
        while (queue.length > 0) {
            const next: string[] = [];
            for (const cur of queue) {
                for (const ch of usable) {
                    const candidate = cur + ch;
                    if (isKSubseq(candidate)) {
                        next.push(candidate);
                        best = candidate;
                    }
                }
            }
            queue.splice(0, queue.length, ...next);
        }
        return best;
    }
}

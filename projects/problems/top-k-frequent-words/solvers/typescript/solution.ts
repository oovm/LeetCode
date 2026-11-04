export class Solution {
    topKFrequent(words: string[], k: number): string[] {
        const counts = new Map<string, number>();
        for (const word of words) counts.set(word, (counts.get(word) ?? 0) + 1);
        return Array.from(counts.keys())
            .sort((left, right) => {
                const leftCount = counts.get(left) as number;
                const rightCount = counts.get(right) as number;
                if (leftCount !== rightCount) return rightCount - leftCount;
                if (left < right) return -1;
                if (left > right) return 1;
                return 0;
            })
            .slice(0, k);
    }
}

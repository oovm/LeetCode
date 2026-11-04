export class Solution {
    areSentencesSimilarTwo(sentence1: string[], sentence2: string[], similarPairs: string[][]): boolean {
        if (sentence1.length !== sentence2.length) return false;

        // 并查集：同义对合并成连通分量。
        const parent = new Map<string, string>();
        const find = (word: string): string => {
            let root = word;
            while (parent.get(root) !== root) root = parent.get(root)!;
            let cursor = word;
            while (parent.get(cursor) !== root) {
                const next = parent.get(cursor)!;
                parent.set(cursor, root);
                cursor = next;
            }
            return root;
        };

        for (const [left, right] of similarPairs) {
            if (!parent.has(left)) parent.set(left, left);
            if (!parent.has(right)) parent.set(right, right);
            const leftRoot = find(left);
            const rightRoot = find(right);
            if (leftRoot !== rightRoot) parent.set(leftRoot, rightRoot);
        }

        // 逐词检查：相同则通过，否则必须都在字典里且属于同一分量。
        for (let i = 0; i < sentence1.length; i++) {
            if (sentence1[i] === sentence2[i]) continue;
            if (!parent.has(sentence1[i]) || !parent.has(sentence2[i])) return false;
            if (find(sentence1[i]) !== find(sentence2[i])) return false;
        }
        return true;
    }
}

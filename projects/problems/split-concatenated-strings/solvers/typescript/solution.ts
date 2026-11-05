export class Solution {
    splitLoopedString(strs: string[]): string {
        for (let i = 0; i < strs.length; i++) {
            const reversed = strs[i].split("").reverse().join("");
            if (reversed > strs[i]) {
                strs[i] = reversed;
            }
        }
        let best = strs.join("");
        for (let i = 0; i < strs.length; i++) {
            const current = strs[i];
            const middle = strs.slice(i + 1).join("") + strs.slice(0, i).join("");
            for (let cut = 0; cut < current.length; cut++) {
                const head = current.slice(cut);
                const prefix = current.slice(0, cut);
                const candidate = head + middle + prefix;
                if (candidate > best) {
                    best = candidate;
                }
                const reversedPrefix = prefix.split("").reverse().join("");
                const reversedHead = head.split("").reverse().join("");
                const other = reversedPrefix + middle + reversedHead;
                if (other > best) {
                    best = other;
                }
            }
        }
        return best;
    }
}

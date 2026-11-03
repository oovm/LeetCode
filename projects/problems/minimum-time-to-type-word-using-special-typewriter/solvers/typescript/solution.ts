export class Solution {
    minTimeToType(word: string): number {
        let time = 0;
        let current = 0;
        for (const ch of word) {
            const target = ch.charCodeAt(0) - 97;
            const diff = Math.abs(target - current);
            time += Math.min(diff, 26 - diff) + 1;
            current = target;
        }
        return time;
    }
}

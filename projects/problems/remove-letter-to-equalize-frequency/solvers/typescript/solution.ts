export class Solution {
    equalFrequency(word: string): boolean {
        const counts = new Array<number>(26).fill(0);
        for (const ch of word) {
            counts[ch.charCodeAt(0) - 97] += 1;
        }
        for (let i = 0; i < 26; i++) {
            if (counts[i] === 0) continue;
            counts[i] -= 1;
            const rest = counts.filter((c) => c > 0);
            if (rest.every((c) => c === rest[0])) {
                return true;
            }
            counts[i] += 1;
        }
        return false;
    }
}

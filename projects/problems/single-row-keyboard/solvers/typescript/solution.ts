export class Solution {
    calculateTime(keyboard: string, word: string): number {
        const position = new Array<number>(26);
        for (let i = 0; i < keyboard.length; i++) {
            position[keyboard.charCodeAt(i) - 97] = i;
        }
        let time = 0;
        let current = 0;
        for (const ch of word) {
            const target = position[ch.charCodeAt(0) - 97];
            time += Math.abs(target - current);
            current = target;
        }
        return time;
    }
}

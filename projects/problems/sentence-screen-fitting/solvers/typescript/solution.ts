export class Solution {
    wordsTyping(sentence: string[], rows: number, cols: number): number {
        const joined = sentence.join(" ") + " ";
        let index = 0;
        for (let r = 0; r < rows; r++) {
            index += cols;
            if (joined[index % joined.length] === " ") {
                index++;
            } else {
                while (index > 0 && joined[(index - 1) % joined.length] !== " ") index--;
            }
        }
        return Math.floor(index / joined.length);
    }
}

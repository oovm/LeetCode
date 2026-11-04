export class Solution {
    printVertically(s: string): string[] {
        const words = s.split(" ");
        const longest = Math.max(...words.map((word) => word.length));
        const lines: string[] = [];
        for (let column = 0; column < longest; column++) {
            let last = 0;
            for (let index = 0; index < words.length; index++) {
                if (words[index].length > column) {
                    last = index + 1;
                }
            }
            let line = "";
            for (let index = 0; index < last; index++) {
                line += words[index].length > column ? words[index][column] : " ";
            }
            lines.push(line);
        }
        return lines;
    }
}

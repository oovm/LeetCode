export class Solution {
    interpret(command: string): string {
        let out = "";
        let i = 0;
        while (i < command.length) {
            const c = command.charCodeAt(i);
            if (c === 71) {
                out += "G";
                i += 1;
            } else if (command.charCodeAt(i + 1) === 41) {
                out += "o";
                i += 2;
            } else {
                out += "al";
                i += 4;
            }
        }
        return out;
    }
}

export class Solution {
    decodeString(s: string): string {
        let i = 0;
        const parse = (): string => {
            let out = "";
            while (i < s.length && s[i] !== "]") {
                if (s[i] >= "0" && s[i] <= "9") {
                    let factor = 0;
                    while (i < s.length && s[i] >= "0" && s[i] <= "9") {
                        factor = factor * 10 + Number(s[i]);
                        i++;
                    }
                    i++;
                    const inner = parse();
                    i++;
                    out += inner.repeat(factor);
                } else {
                    out += s[i];
                    i++;
                }
            }
            return out;
        };
        return parse();
    }
}

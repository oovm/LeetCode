export class Solution {
    expand(s: string): string[] {
        let i = 0;
        const parse = (stopAtComma: boolean): string[] => {
            let out: string[] = [""];
            while (i < s.length) {
                const ch = s[i];
                if (ch === "}") {
                    break;
                }
                if (ch === "," && stopAtComma) {
                    break;
                }
                if (ch === "{") {
                    i++;
                    const options: string[] = [];
                    while (true) {
                        options.push(...parse(true));
                        if (s[i] === ",") {
                            i++;
                            continue;
                        }
                        i++;
                        break;
                    }
                    const combined: string[] = [];
                    for (const prefix of out) {
                        for (const option of options) {
                            combined.push(prefix + option);
                        }
                    }
                    out = combined;
                } else {
                    i++;
                    out = out.map((prefix) => prefix + ch);
                }
            }
            return out;
        };
        return parse(false);
    }
}

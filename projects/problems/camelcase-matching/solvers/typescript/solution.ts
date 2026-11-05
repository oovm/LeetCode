export class Solution {
    camelMatch(queries: string[], pattern: string): boolean[] {
        const isLower = (code: number) => code >= 97 && code <= 122;
        const matches = (query: string) => {
            if (query.length < pattern.length) {
                return false;
            }
            let qi = 0;
            let pi = 0;
            while (pi < pattern.length) {
                while (qi < query.length && query[qi] !== pattern[pi] && isLower(query.charCodeAt(qi))) {
                    qi++;
                }
                if (qi === query.length || query[qi] !== pattern[pi]) {
                    return false;
                }
                qi++;
                pi++;
            }
            while (qi < query.length && isLower(query.charCodeAt(qi))) {
                qi++;
            }
            return qi === query.length;
        };
        return queries.map(matches);
    }
}

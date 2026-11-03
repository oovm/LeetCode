export class Solution {
    countMatches(items: string[][], ruleKey: string, ruleValue: string): number {
        const idx = ruleKey === "type" ? 0 : ruleKey === "color" ? 1 : 2;
        return items.filter((item) => item[idx] === ruleValue).length;
    }
}

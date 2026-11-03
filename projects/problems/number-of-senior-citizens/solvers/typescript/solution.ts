export class Solution {
    countSeniors(details: string[]): number {
        return details.filter((d) => Number(d.slice(11, 13)) > 60).length;
    }
}

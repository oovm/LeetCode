export class Solution {
    convertDateToBinary(date: string): string {
        return date
            .split('-')
            .map((part) => Number(part).toString(2))
            .join('-');
    }
}

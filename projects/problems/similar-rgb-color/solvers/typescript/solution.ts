export class Solution {
    similarRGB(color: string): string {
        const nearest = (pair: string): string => {
            const value = parseInt(pair, 16);
            const q = Math.round(value / 17);
            return q.toString(16).repeat(2);
        };
        return `#${nearest(color.slice(1, 3))}${nearest(color.slice(3, 5))}${nearest(color.slice(5, 7))}`;
    }
}

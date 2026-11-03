export class Solution {
    numberToWords(num: number): string {
        if (num === 0) return 'Zero';
        const below20 = [
            '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
            'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen',
            'Eighteen', 'Nineteen',
        ];
        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
        const chunk = (x: number): string => {
            const parts: string[] = [];
            if (x >= 100) {
                parts.push(below20[Math.floor(x / 100)], 'Hundred');
                x %= 100;
            }
            if (x >= 20) {
                parts.push(tens[Math.floor(x / 10)]);
                x %= 10;
            }
            if (x > 0) parts.push(below20[x]);
            return parts.join(' ');
        };
        const scales = ['', 'Thousand', 'Million', 'Billion'];
        const parts: string[] = [];
        let rest = num;
        let scale = 0;
        while (rest > 0) {
            const c = rest % 1000;
            if (c > 0) {
                parts.unshift(scales[scale] ? `${chunk(c)} ${scales[scale]}` : chunk(c));
            }
            rest = Math.floor(rest / 1000);
            scale += 1;
        }
        return parts.join(' ');
    }
}

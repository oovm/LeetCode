export class Solution {
    reformatDate(date: string): string {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const [day, month, year] = date.split(' ');
        const dd = String(parseInt(day, 10)).padStart(2, '0');
        const mm = String(months.indexOf(month) + 1).padStart(2, '0');
        return `${year}-${mm}-${dd}`;
    }
}

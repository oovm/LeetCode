export class Solution {
    hasMatch(s: string, p: string): boolean {
        const star = p.indexOf('*');
        const head = p.slice(0, star);
        const tail = p.slice(star + 1);
        const start = s.indexOf(head);
        if (start === -1) {
            return false;
        }
        const end = s.indexOf(tail, start + head.length);
        return end !== -1;
    }
}

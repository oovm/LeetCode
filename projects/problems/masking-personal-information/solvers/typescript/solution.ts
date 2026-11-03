export class Solution {
    maskPII(s: string): string {
        if (s.includes('@')) {
            const [name, domain] = s.toLowerCase().split('@');
            return `${name[0]}*****${name[name.length - 1]}@${domain}`;
        }
        const digits = s.replaceAll(/\D/g, '');
        const tail = digits.slice(-4);
        const local = `***-***-${tail}`;
        const extra = digits.length - 10;
        return extra > 0 ? `+${'*'.repeat(extra)}-${local}` : local;
    }
}

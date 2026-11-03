export class Solution {
    validIPAddress(queryIP: string): string {
        if (queryIP.includes('.')) {
            const parts = queryIP.split('.');
            const ok =
                parts.length === 4 &&
                parts.every((p) => /^\d{1,3}$/.test(p) && Number(p) <= 255 && (p === '0' || !p.startsWith('0')));
            return ok ? 'IPv4' : 'Neither';
        }
        if (queryIP.includes(':')) {
            const parts = queryIP.split(':');
            const ok = parts.length === 8 && parts.every((p) => /^[0-9a-fA-F]{1,4}$/.test(p));
            return ok ? 'IPv6' : 'Neither';
        }
        return 'Neither';
    }
}

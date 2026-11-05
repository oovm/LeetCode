export class Solution {
    ipToCIDR(ip: string, n: number): string[] {
        const limit = 4294967296;
        const parts = ip.split('.');
        let start = 0;
        for (let index = 0; index < 4; index++) {
            start = start * 256 + Number(parts[index]);
        }
        const out: string[] = [];
        let remaining = n;
        while (remaining > 0) {
            let block = 1;
            while (block * 2 <= remaining && block * 2 <= limit && start % (block * 2) === 0) {
                block *= 2;
            }
            const prefix = 32 - Math.log2(block);
            const first = Math.floor(start / 16777216);
            const second = Math.floor(start / 65536) % 256;
            const third = Math.floor(start / 256) % 256;
            const fourth = start % 256;
            out.push(`${first}.${second}.${third}.${fourth}/${prefix}`);
            start += block;
            remaining -= block;
        }
        return out;
    }
}

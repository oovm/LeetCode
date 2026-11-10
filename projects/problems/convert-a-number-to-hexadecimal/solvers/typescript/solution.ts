export class Solution {
    toHex(num: number): string {
        if (num === 0) return "0";
        const hex = "0123456789abcdef";
        const base = BigInt(num);
        let out = "";
        for (let i = 7; i >= 0; i--) {
            const x = Number((base >> BigInt(4 * i)) & 0xFn);
            if (out !== "" || x !== 0) out += hex[x];
        }
        return out;
    }
}

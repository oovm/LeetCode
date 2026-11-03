export class Solution {
    abbreviateProduct(right: number, left: number): number | string {
        const MOD = 10n ** 11n;
        let logSum = 0;
        let suffix = 1n;
        let twos = 0;
        let fives = 0;
        for (let v = left; v <= right; v++) {
            logSum += Math.log10(v);
            let x = v;
            while (x % 2 === 0) {
                x /= 2;
                twos += 1;
            }
            while (x % 5 === 0) {
                x /= 5;
                fives += 1;
            }
            suffix = (suffix * BigInt(x)) % MOD;
        }
        const zeros = Math.min(twos, fives);
        const rest = twos - zeros;
        for (let i = 0; i < rest; i++) {
            suffix = (suffix * 2n) % MOD;
        }
        const totalDigits = Math.floor(logSum) + 1;
        if (totalDigits <= 10) {
            let full = 1n;
            for (let v = left; v <= right; v++) full *= BigInt(v);
            return full.toString();
        }
        const leadExp = logSum - Math.floor(logSum) + 4;
        const lead = Math.floor(10 ** leadExp);
        const tail = suffix % 100000n;
        return `${lead}...${String(tail).padStart(5, '0')}e${zeros}`;
    }
}

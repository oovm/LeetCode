export class Solution {
    peopleAwareOfSecret(n: number, delay: number, forget: number): number {
        const MOD = 1000000007;
        // active[day] = 第 day 天新获知秘密的人数；逐日向 [day+delay, day+forget) 传播。
        const active = new Array<number>(n + 1).fill(0);
        active[1] = 1;
        for (let day = 1; day <= n; day++) {
            for (let spread = day + delay; spread < day + forget && spread <= n; spread++) {
                active[spread] = ((active[spread] as number) + (active[day] as number)) % MOD;
            }
        }
        let answer = 0;
        for (let day = n - forget + 1; day <= n; day++) {
            answer = (answer + (active[day] as number)) % MOD;
        }
        return answer;
    }
}

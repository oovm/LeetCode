export class Solution {
    canReach(s: string, minJump: number, maxJump: number): boolean {
        const n = s.length;
        const reach = new Array<boolean>(n).fill(false);
        reach[0] = true;
        let window = 0;
        for (let i = 0; i < n; i++) {
            if (i > 0) {
                if (i - minJump >= 0 && reach[i - minJump]) window += 1;
                if (i - maxJump - 1 >= 0 && reach[i - maxJump - 1]) window -= 1;
                reach[i] = s[i] === '0' && window > 0;
            }
        }
        return reach[n - 1];
    }
}

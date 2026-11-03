export class Solution {
    predictPartyVictory(senate: string): string {
        const radiant: number[] = [];
        const dire: number[] = [];
        for (let i = 0; i < senate.length; i++) {
            (senate[i] === 'R' ? radiant : dire).push(i);
        }
        let n = senate.length;
        while (radiant.length > 0 && dire.length > 0) {
            if (radiant[0] < dire[0]) {
                radiant.push(n);
            } else {
                dire.push(n);
            }
            radiant.shift();
            dire.shift();
            n += 1;
        }
        return radiant.length > 0 ? 'Radiant' : 'Dire';
    }
}

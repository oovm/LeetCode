export class Solution {
    canCompleteCircuit(gas: number[], cost: number[]): number {
        let tank = 0;
        let start = 0;
        let balance = 0;
        for (let i = 0; i < gas.length; i++) {
            tank += gas[i] - cost[i];
            balance += gas[i] - cost[i];
            if (tank < 0) {
                start = i + 1;
                tank = 0;
            }
        }
        return balance >= 0 ? start : -1;
    }
}

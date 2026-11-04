export class Solution {
    numOfMinutes(n: number, headID: number, manager: number[], informTime: number[]): number {
        const reports: number[][] = [];
        for (let employee = 0; employee < n; employee++) reports.push([]);
        for (let employee = 0; employee < n; employee++) {
            const lead = manager[employee];
            if (lead >= 0) reports[lead].push(employee);
        }
        const depth = (employee: number): number => {
            if (reports[employee].length === 0) return 0;
            let longest = 0;
            for (const report of reports[employee]) longest = Math.max(longest, depth(report));
            return longest + informTime[employee];
        };
        return depth(headID);
    }
}

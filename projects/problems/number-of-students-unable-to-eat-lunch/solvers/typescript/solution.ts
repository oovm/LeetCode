export class Solution {
    countStudents(students: number[], sandwiches: number[]): number {
        const want = [0, 0];
        for (const s of students) want[s]++;
        for (const top of sandwiches) {
            if (want[top] === 0) return want[0] + want[1];
            want[top]--;
        }
        return 0;
    }
}

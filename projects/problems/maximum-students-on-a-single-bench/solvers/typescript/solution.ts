export class Solution {
    maxStudentsOnBench(students: number[][]): number {
        const benches = new Map<number, Set<number>>();
        for (const [id, bench] of students) {
            if (!benches.has(bench)) benches.set(bench, new Set());
            benches.get(bench)!.add(id);
        }
        return Math.max(0, ...[...benches.values()].map((s) => s.size));
    }
}

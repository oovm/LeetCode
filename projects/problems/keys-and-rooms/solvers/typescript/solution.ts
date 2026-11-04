export class Solution {
    canVisitAllRooms(rooms: number[][]): boolean {
        const visited = new Set<number>([0]);
        const stack: number[] = [0];
        while (stack.length > 0) {
            const room = stack.pop() as number;
            for (const key of rooms[room]) {
                if (!visited.has(key)) {
                    visited.add(key);
                    stack.push(key);
                }
            }
        }
        return visited.size === rooms.length;
    }
}

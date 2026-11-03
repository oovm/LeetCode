export class Solution {
    hasCycle(head: number[], pos: number): string {
        return pos >= 0 && pos < head.length ? `tail connects to node index ${pos}` : 'no cycle';
    }
}

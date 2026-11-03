export class Solution {
    getIntersectionNode(headA: number[], headB: number[], skipA: number, skipB: number): string {
        let a = skipA;
        let b = skipB;
        while (a !== b) {
            a = a < headA.length ? a + 1 : skipB;
            b = b < headB.length ? b + 1 : skipA;
            if (a >= headA.length && b >= headB.length && headA.length === skipA && headB.length === skipB) {
                return 'no intersection';
            }
        }
        return a < headA.length ? `Intersected at '${headA[a]}'` : 'no intersection';
    }
}

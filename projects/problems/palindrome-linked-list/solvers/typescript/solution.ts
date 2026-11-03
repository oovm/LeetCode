export class Solution {
    isPalindrome(head: number[]): boolean {
        for (let i = 0, j = head.length - 1; i < j; i++, j--) {
            if (head[i] !== head[j]) return false;
        }
        return true;
    }
}

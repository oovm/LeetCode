export class Solution {
    isBalanced(num: string): boolean {
        let even = 0;
        let odd = 0;
        for (let i = 0; i < num.length; i++) {
            if (i % 2 === 0) even += num.charCodeAt(i) - 48;
            else odd += num.charCodeAt(i) - 48;
        }
        return even === odd;
    }
}

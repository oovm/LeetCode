export class Solution {
    smallestSubsequence(s: string, k: number, letter: string, repetition: number): string {
        const totalLetter = [...s].filter((c) => c === letter).length;
        const stack: string[] = [];
        let usedLetter = 0;
        for (let i = 0; i < s.length; i++) {
            const ch = s[i];
            while (
                stack.length > 0 &&
                stack[stack.length - 1] > ch &&
                stack.length - 1 + (s.length - i) >= k &&
                (stack[stack.length - 1] !== letter || usedLetter - 1 + (totalLetter - [...s.slice(i)].filter((c) => c === letter).length) >= repetition)
            ) {
                if (stack.pop() === letter) usedLetter -= 1;
            }
            if (stack.length < k && (ch === letter || k - stack.length > repetition - usedLetter)) {
                stack.push(ch);
                if (ch === letter) usedLetter += 1;
            }
        }
        return stack.join('');
    }
}

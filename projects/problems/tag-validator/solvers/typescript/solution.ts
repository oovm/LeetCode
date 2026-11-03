export class Solution {
    isValid(code: string): boolean {
        const stack: string[] = [];
        let i = 0;
        if (code[0] !== '<') return false;
        while (i < code.length) {
            if (stack.length === 0 && i > 0) return false;
            if (code.startsWith('<!--', i)) {
                const end = code.indexOf('-->', i + 4);
                if (end === -1) return false;
                i = end + 3;
            } else if (code.startsWith('<![CDATA[', i)) {
                const end = code.indexOf(']]>', i + 9);
                if (end === -1) return false;
                i = end + 3;
            } else if (code.startsWith('</', i)) {
                const end = code.indexOf('>', i + 2);
                if (end === -1) return false;
                const tag = code.slice(i + 2, end);
                if (stack.pop() !== tag) return false;
                i = end + 1;
            } else if (code[i] === '<') {
                const end = code.indexOf('>', i + 1);
                if (end === -1) return false;
                const tag = code.slice(i + 1, end);
                if (!/^[A-Z]{1,9}$/.test(tag)) return false;
                stack.push(tag);
                i = end + 1;
            } else {
                i += 1;
            }
        }
        return stack.length === 0;
    }
}

export class Solution {
    reorderLogFiles(logs: string[]): string[] {
        const isLetter = (log: string): boolean => {
            const rest = log.slice(log.indexOf(" ") + 1);
            const first = rest.charCodeAt(0);
            return (first >= 97 && first <= 122) || (first >= 65 && first <= 90);
        };
        const parts = (log: string): { id: string; content: string } => {
            const space = log.indexOf(" ");
            return { id: log.slice(0, space), content: log.slice(space + 1) };
        };
        const letters = logs.filter(isLetter).sort((a, b) => {
            const left = parts(a);
            const right = parts(b);
            if (left.content < right.content) return -1;
            if (left.content > right.content) return 1;
            if (left.id < right.id) return -1;
            if (left.id > right.id) return 1;
            return 0;
        });
        const digits = logs.filter((log) => !isLetter(log));
        return [...letters, ...digits];
    }
}

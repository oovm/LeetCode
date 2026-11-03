export class Solution {
    wordPattern(pattern: string, s: string): boolean {
        const words = s.split(' ');
        if (words.length !== pattern.length) {
            return false;
        }
        const forward = new Map<string, string>();
        const backward = new Map<string, string>();
        for (let i = 0; i < pattern.length; i++) {
            const p = pattern[i];
            const w = words[i];
            if ((forward.get(p) ?? w) !== w || (backward.get(w) ?? p) !== p) {
                return false;
            }
            forward.set(p, w);
            backward.set(w, p);
        }
        return true;
    }
}

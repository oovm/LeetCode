export class Solution {
    findMode(root: (number | null)[]): number[] {
        const modes: number[] = [];
        let prev: number | null = null;
        let run = 0;
        let best = 0;
        const visit = (v: number): void => {
            run = prev !== null && v === prev ? run + 1 : 1;
            prev = v;
            if (run > best) {
                best = run;
                modes.length = 0;
                modes.push(v);
            } else if (run === best) {
                modes.push(v);
            }
        };
        const walk = (i: number): void => {
            if (i >= root.length || root[i] === null) return;
            walk(2 * i + 1);
            visit(root[i]!);
            walk(2 * i + 2);
        };
        walk(0);
        return modes;
    }
}

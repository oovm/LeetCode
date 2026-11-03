export class Solution {
    canChange(start: string, target: string): boolean {
        const strip = (s: string): string => s.replaceAll('_', '');
        if (strip(start) !== strip(target)) {
            return false;
        }
        let j = 0;
        for (let i = 0; i < start.length; i++) {
            if (start[i] === '_') continue;
            while (target[j] === '_') j += 1;
            if (start[i] === 'L' && i < j) return false;
            if (start[i] === 'R' && i > j) return false;
            j += 1;
        }
        return true;
    }
}
